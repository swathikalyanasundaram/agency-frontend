import { Menu } from 'lucide-react'
import { CSSProperties, useEffect, useRef, useState } from 'react'

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const SPOTLIGHT_R = 260

type Point = { x: number; y: number }

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [maskImage, setMaskImage] = useState('none')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
      ctx.fill()

      setMaskImage(canvas.toDataURL())
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [cursorX, cursorY])

  const style: CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage: `url(${maskImage})`,
    WebkitMaskImage: `url(${maskImage})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%'
  }

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div className="absolute inset-0 z-30 pointer-events-none bg-center bg-cover bg-no-repeat" style={style} />
    </>
  )
}

export default function App() {
  const mouse = useRef<Point>({ x: -999, y: -999 })
  const smooth = useRef<Point>({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const [cursorPos, setCursorPos] = useState<Point>({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY }
    }

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-6 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <a href="#top" aria-label="Yezhuththu home" className="flex items-center gap-2.5 text-decoration-none">
          <span className="text-white text-2xl font-bold tracking-tight">yezhuththu<span className="text-orange-500">.site</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Services</a>
          <a href="#capabilities" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Capabilities</a>
          <a href="#pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Pricing</a>
        </div>

        <a href="#contact" className="hidden md:inline-flex bg-white text-gray-950 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all">
          Start Project
        </a>
        <button className="md:hidden p-2 text-white" aria-label="Open menu">
          <Menu size={25} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Cinematic Motion-Graphic Spotlight Hero Section with Exact Brand Copy */}
      <section id="top" className="relative w-full overflow-hidden h-screen bg-black flex items-center justify-center" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat opacity-90" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-4 md:px-8 pointer-events-none">
          <div className="text-xs uppercase tracking-[0.25em] text-indigo-300 font-semibold mb-4">
            Websites • Marketing • SEO
          </div>
          <h1 className="text-white leading-[0.92] max-w-6xl">
            <span className="block font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-1">
              Every business
            </span>
            <span className="block font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-1">
              starts with the
            </span>
            <span className="block font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-1 italic font-serif text-indigo-300">
              right words,
            </span>
            <span className="block font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-1">
              then a website that
            </span>
            <span className="block font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
              carries them.
            </span>
          </h1>
        </div>

        <div className="hidden sm:block absolute bottom-10 left-10 md:left-14 max-w-[280px] z-50">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
            Yezhuththu means "script" — the letters that carry a message. We build the sites, campaigns, and search visibility that carry yours.
          </p>
        </div>

        <div className="absolute bottom-8 sm:bottom-14 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[280px] z-50 flex flex-col items-start gap-3">
          <p className="text-xs text-white/70 leading-relaxed font-light">
            Discover our custom packages, dynamic backends, and cloud DevOps setups to elevate your brand presence.
          </p>
          <a href="#contact" className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#e8702a]/30">
            Start Project
          </a>
        </div>
      </section>

      {/* Subsequent Content Sections */}
      <section id="services" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Three services, built to work together.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <span className="text-orange-400 font-mono text-sm mb-4 block">01</span>
            <h3 className="text-xl font-bold mb-3">Website Building</h3>
            <p className="text-white/70 text-sm leading-relaxed">Custom-designed, fast-loading sites and web apps — from a landing page to full platforms.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <span className="text-orange-400 font-mono text-sm mb-4 block">02</span>
            <h3 className="text-xl font-bold mb-3">Digital Marketing</h3>
            <p className="text-white/70 text-sm leading-relaxed">Campaigns across search, social, and email tailored to what your business sells.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <span className="text-orange-400 font-mono text-sm mb-4 block">03</span>
            <h3 className="text-xl font-bold mb-3">SEO & Technical Work</h3>
            <p className="text-white/70 text-sm leading-relaxed">Site structure, performance speed, and search optimization to get you found online.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
