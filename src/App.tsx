import { Menu, ArrowRight, CheckCircle2, Sparkles, Globe, Megaphone, Search, ShoppingBag } from 'lucide-react'
import { CSSProperties, useEffect, useRef, useState } from 'react'

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const SPOTLIGHT_R = 260

type Point = { x: number; y: number }

const SERVICES_DATA = [
  {
    num: '01',
    title: 'Website Building',
    desc: 'Custom-designed web apps and immersive landing pages optimized for high conversion rates.',
    tag: 'Custom Architecture',
    Icon: Globe,
    color: 'purple'
  },
  {
    num: '02',
    title: 'Digital Marketing',
    desc: 'Targeted multichannel campaigns designed around your exact value proposition.',
    tag: 'Conversion Focused',
    Icon: Megaphone,
    color: 'indigo'
  },
  {
    num: '03',
    title: 'SEO & Technical',
    desc: 'Structural optimization, lightning-fast speed audits, and organic traffic expansion.',
    tag: 'Organic Authority',
    Icon: Search,
    color: 'pink'
  },
  {
    num: '04',
    title: 'E-Commerce Solutions',
    desc: 'Scalable storefronts with instant payment gateways and real-time inventory management.',
    tag: 'High Performance',
    Icon: ShoppingBag,
    color: 'emerald'
  }
]

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
  const [activeSection, setActiveSection] = useState<'home' | 'services' | 'contact'>('home')

  const [formData, setFormData] = useState({
    clientname: '',
    email: '',
    serviceType: 'Static Website',
    estimatedBudget: 12000,
    projectOverview: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3
      const servicesEl = document.getElementById('services')
      const contactEl = document.getElementById('contact')

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('contact')
      } else if (servicesEl && scrollPos >= servicesEl.offsetTop) {
        setActiveSection('services')
      } else {
        setActiveSection('home')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const finalOverview = formData.projectOverview.trim() !== '' 
      ? formData.projectOverview.trim() 
      : 'No overview provided'

    try {
      const response = await fetch('https://agency-backend-t8oq.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          clientname: formData.clientname.trim(),
          email: formData.email.trim(),
          serviceType: formData.serviceType,
          estimatedBudget: Number(formData.estimatedBudget),
          projectOverview: finalOverview
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ clientname: '', email: '', serviceType: 'Static Website', estimatedBudget: 12000, projectOverview: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert('Server rejection status: ' + response.status)
      }
    } catch (err) {
      console.error('Network Error:', err)
      alert('Could not reach backend database server.')
    } finally {
      setSubmitting(false)
    }
  }

  const bgOpacity = activeSection === 'home' 
    ? 'opacity-90 brightness-100' 
    : activeSection === 'services' 
    ? 'opacity-50 brightness-75' 
    : 'opacity-40 brightness-50'

  // Double array to construct seamless marquee loop
  const marqueeItems = [...SERVICES_DATA, ...SERVICES_DATA]

  return (
    <main className="min-h-screen text-white tracking-[-0.02em] font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden bg-black relative">
      <style>{`
        @keyframes marqueeSlow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          width: max-content;
          animation: marqueeSlow 40s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* FIXED GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700">
        <div className={`absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700 ${bgOpacity}`} style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeSection === 'home' ? 'opacity-100' : 'opacity-60'}`}>
          <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 sm:px-10 bg-black/40 backdrop-blur-xl border-b border-white/[0.06]">
        <a href="#home" className="flex items-center gap-2 text-decoration-none">
          <span className="text-white text-xl font-bold tracking-tight">yezhuththu<span className="text-purple-400">.site</span></span>
        </a>

        <div className="hidden md:flex items-center gap-6 bg-white/[0.02] border border-white/[0.08] rounded-full px-6 py-2 backdrop-blur-md">
          <a href="#home" className="text-xs font-medium text-white hover:text-purple-300 transition-colors">Home</a>
          <a href="#services" className="text-xs font-medium text-white/70 hover:text-white transition-colors">Services</a>
          <a href="#contact" className="text-xs font-medium text-white/70 hover:text-white transition-colors">Contact</a>
        </div>

        <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/20">
          Get a Quote <ArrowRight size={14} />
        </a>
        <button className="md:hidden p-2 text-white" aria-label="Open menu">
          <Menu size={22} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Page 1: Hero */}
      <section id="home" className="relative w-full h-screen flex items-center justify-center z-10" style={{ height: '100dvh' }}>
        <div className="absolute top-[22%] left-0 right-0 z-50 flex flex-col items-center text-center px-4 md:px-8 pointer-events-none">
          <div className="text-xs uppercase tracking-[0.25em] text-indigo-300 font-semibold mb-4 flex items-center gap-2">
            <Sparkles size={14} /> Websites • Marketing • SEO
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
      </section>

      {/* Page 2: Services with Slow Infinite Loop Animation */}
      <section id="services" className="relative min-h-screen flex flex-col justify-center items-center py-32 z-10 overflow-hidden">
        <div className="max-w-6xl w-full text-center px-6 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-purple-300 font-semibold mb-3 block">What We Offer</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">Engineered for growth.</h2>
          <p className="text-white/70 max-w-lg mx-auto text-sm sm:text-base font-light">Comprehensive digital solutions running in continuous alignment with your brand.</p>
        </div>

        {/* Infinite Loop Track Container with Masked Fade Edges */}
        <div className="w-full relative py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-slow flex gap-6 px-4">
            {marqueeItems.map((item, idx) => {
              const IconComp = item.Icon
              return (
                <div 
                  key={idx}
                  className="w-[320px] sm:w-[380px] shrink-0 bg-black/60 hover:bg-black/80 border border-white/15 hover:border-purple-400/80 p-8 rounded-3xl transition-all duration-300 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                        <IconComp size={22} />
                      </div>
                      <span className="text-xs font-mono text-white/40 group-hover:text-purple-300 transition-colors">{item.num}</span>
                    </div>

                    <h3 className="text-white font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed font-light mb-8">{item.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 pt-4 border-t border-white/10">
                    <CheckCircle2 size={14} /> {item.tag}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Page 3: Contact */}
      <section id="contact" className="relative min-h-screen flex flex-col justify-center items-center px-6 py-32 z-10">
        <div className="w-full max-w-xl bg-black/70 border border-white/20 p-8 sm:p-12 rounded-3xl backdrop-blur-3xl shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-purple-300 font-semibold mb-2 block">Get in Touch</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">Start Your Project</h2>
            <p className="text-white/70 text-xs sm:text-sm font-light">Submit your project specs to securely save to the backend database.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs uppercase tracking-wider text-white/70 font-medium">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.clientname}
                onChange={e => setFormData({...formData, clientname: e.target.value})}
                placeholder="John Doe"
                className="bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs uppercase tracking-wider text-white/70 font-medium">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs uppercase tracking-wider text-white/70 font-medium">Service Required</label>
                <select 
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value})}
                  className="bg-zinc-950 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 transition-colors cursor-pointer"
                >
                  <option value="Static Website">Static Website</option>
                  <option value="Dynamic Website">Dynamic Website</option>
                  <option value="Studio Complete">Studio Complete</option>
                  <option value="E-Commerce Solution">E-Commerce Solution</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs uppercase tracking-wider text-white/70 font-medium">Estimated Budget (₹)</label>
                <input 
                  type="number"
                  required
                  value={formData.estimatedBudget}
                  onChange={e => setFormData({...formData, estimatedBudget: Number(e.target.value)})}
                  placeholder="12000"
                  className="bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs uppercase tracking-wider text-white/70 font-medium">Project Overview</label>
              <textarea 
                rows={4}
                value={formData.projectOverview}
                onChange={e => setFormData({...formData, projectOverview: e.target.value})}
                placeholder="Tell us about your project goals..."
                className="bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 transition-colors resize-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="mt-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Transmitting...' : 'Submit Request'} <ArrowRight size={16} />
            </button>
            {submitted && (
              <p className="text-emerald-400 text-xs text-center font-medium mt-2 animate-fade-in">✓ Success! Inquiry securely saved to your backend database.</p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
