import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight } from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];
const SERVICE_OPTIONS = ["Brand", "Digital", "Campaign", "Other"];

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevX = useRef<number | null>(null);

  const { displayed, done } = useTypewriter("we'd love to\nhear from you!");

  // Desktop mouse scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      if (!video.duration || Number.isNaN(video.duration)) return;

      const deltaTime = (delta / window.innerWidth) * 0.8 * video.duration;
      let target = video.currentTime + deltaTime;
      target = Math.max(0, Math.min(video.duration, target));
      video.currentTime = target;
    };

    const handleSeeked = () => {};

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // Mobile autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.play().catch(() => {});
    }
  }, []);

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="hero-root relative bg-white text-neutral-900 antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .hero-root { font-family: 'Inter', system-ui, sans-serif; }
        .hero-root ::selection { background: #EAECE9; color: #1C2E1E; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }

        .logo-text { font-size: 21px; letter-spacing: -0.01em; }
        @media (min-width: 640px) { .logo-text { font-size: 26px; } }

        .logo-asterisk { font-size: 25px; letter-spacing: -0.02em; }
        @media (min-width: 640px) { .logo-asterisk { font-size: 30px; } }

        .nav-link { font-size: 23px; }

        .hero-headline { font-size: 44px; }
        @media (min-width: 768px) { .hero-headline { font-size: 58px; } }
        @media (min-width: 1024px) { .hero-headline { font-size: 76px; } }

        .hero-video { object-position: right center; }
        @media (min-width: 1024px) { .hero-video { object-position: right bottom; } }

        /* Light color grade: nudges the footage toward the sage/ink palette instead of
           sitting as a flat, untouched clip against the rest of the page. */
        .hero-video-grade { filter: saturate(0.92) contrast(1.04) brightness(1.01); }

        /* Gradient scrim keeps the fixed navbar and headline readable over bright
           frames without darkening the video into a generic overlay wash. */
        .hero-video-scrim {
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0) 22%,
            rgba(255, 255, 255, 0) 78%,
            rgba(28, 46, 30, 0.12) 100%
          );
        }
        @media (min-width: 1024px) {
          .hero-video-scrim {
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.55) 0%,
              rgba(255, 255, 255, 0.15) 30%,
              rgba(255, 255, 255, 0) 55%
            );
          }
        }

        .desc-color { color: #5A635A; }
        .subtitle-color { color: #738273; }
        .pill-active { background-color: #1C2E1E; }
        .pill-text { color: #1C2E1E; }
        .pill-border { border-color: #F1F3F1; }
        .pill-hover:hover { background-color: rgba(241, 243, 241, 0.55); }
        .banner-bg { background-color: #FAFBF9; }
        .cta-color { color: #4D6D47; }
        .mobile-overlay { background-color: rgba(255,255,255,0.95); backdrop-filter: blur(6px); }
      `}</style>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        <div className="flex flex-row items-center gap-3">
          <span className="logo-text text-black font-medium select-none">
            Mainframe&reg;
          </span>
          <span className="logo-asterisk text-black select-none font-medium leading-none mb-1">
            &#10033;
          </span>
        </div>

        <nav className="hidden md:flex flex-row items-center nav-link text-black">
          {NAV_LINKS.map((link, i) => (
            <span key={link} className="flex items-center">
              <a href="#" className="hover:opacity-60 transition-opacity">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        <a
          href="#"
          className="hidden md:inline nav-link text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="md:hidden relative z-20 flex flex-col justify-center items-center gap-[5px] w-6 h-6"
          onClick={() => setIsMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div
        className={`mobile-overlay fixed inset-0 z-[9] flex flex-col items-center justify-center gap-8 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-3xl text-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="text-3xl text-black underline underline-offset-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>

      {/* Background video */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="hero-video hero-video-grade w-full h-full object-cover"
          src={VIDEO_SRC}
        />
        {/* Scrim: keeps the navbar/typewriter legible over bright footage without flattening the video */}
        <div className="hero-video-scrim absolute inset-0" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-headline font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl desc-color leading-relaxed font-normal mb-14 max-w-2xl">
              Whether you have questions, feedback, <br />
              drop us a message and we&apos;ll get back to you as soon as
              possible.
            </p>
          </motion.div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">
              What sort of service?
            </h2>
            <p className="opacity-85 subtitle-color mb-8">
              Select all that apply
            </p>

            <div className="flex flex-wrap gap-3">
              {SERVICE_OPTIONS.map((service) => {
                const active = services.includes(service);
                return (
                  <motion.button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? "pill-active text-white border-transparent shadow-md"
                        : "bg-white pill-text pill-border pill-hover"
                    }`}
                    style={
                      active
                        ? { boxShadow: "0 4px 10px rgba(6,20,10,0.08)" }
                        : undefined
                    }
                  >
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center"
                      >
                        <Check size={14} />
                      </motion.span>
                    )}
                    {service}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {services.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="italic text-xs mt-6"
                >
                  Please click to select services above.
                </motion.p>
              ) : (
                <motion.div
                  key="active"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="banner-bg border pill-border rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm pill-text">
                      Ready to inquire about: {services.join(", ")}
                    </p>
                    <button
                      type="button"
                      className="flex items-center gap-1 cta-color uppercase text-xs tracking-wide font-medium hover:opacity-70 transition-opacity"
                    >
                      Let&apos;s Go <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}