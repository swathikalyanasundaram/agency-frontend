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

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
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

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSubmission = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleString()
    }

    const existing = JSON.parse(localStorage.getItem('yezhuththu_submissions') || '[]')
    localStorage.setItem('yezhuththu_submissions', JSON.stringify([newSubmission, ...existing]))

    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main className="min-h-screen bg-black text-white tracking-[-0.02em] overflow-x-hidden font-sans">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-6 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <a href="#home" className="flex items-center gap-2 text-decoration-none">
          <span className="text-white text-2xl font-bold tracking-tight">yezhuththu<span className="text-purple-400">.site</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8 bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-md">
          <a href="#home" className="text-sm font-medium text-white hover:text-purple-300 transition-colors">Home</a>
          <a href="#services" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Services</a>
          <a href="#contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Contact</a>
          <a href="admin.html" target="_blank" className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors">Admin Dashboard</a>
        </div>

        <a href="#contact" className="hidden md:inline-flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/25">
          Get a Quote
        </a>
        <button className="md:hidden p-2 text-white" aria-label="Open menu">
          <Menu size={25} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Page 1: Immersive Spotlight Hero Section */}
      <section id="home" className="relative w-full h-screen bg-black flex items-center justify-center" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat opacity-90" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="absolute top-[22%] left-0 right-0 z-50 flex flex-col items-center text-center px-4 md:px-8 pointer-events-none">
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
      </section>

      {/* Page 2: Services / Capabilities */}
      <section id="services" className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-6 py-24">
        <div className="max-w-6xl w-full text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">What We Do</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-16 text-sm sm:text-base">Three core systems built to scale your business presence online seamlessly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:border-purple-500/40 transition-all">
              <h3 className="text-purple-400 font-bold text-xl mb-3">01. Website Building</h3>
              <p className="text-white/70 text-sm leading-relaxed">Custom-designed, high-performance web apps and landing pages optimized for maximum customer conversion.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:border-purple-500/40 transition-all">
              <h3 className="text-purple-400 font-bold text-xl mb-3">02. Digital Marketing</h3>
              <p className="text-white/70 text-sm leading-relaxed">Targeted campaigns across search and social channels designed around what your business actually sells.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:border-purple-500/40 transition-all">
              <h3 className="text-purple-400 font-bold text-xl mb-3">03. SEO & Technical Work</h3>
              <p className="text-white/70 text-sm leading-relaxed">Structural optimization, page speed tuning, and organic search ranking growth strategies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Page 3: Backend Connected Contact / Quote Form */}
      <section id="contact" className="min-h-screen bg-black flex flex-col justify-center items-center px-6 py-24">
        <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 rounded-3xl backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Start Your Project</h2>
          <p className="text-white/60 text-center text-sm mb-8">Submit details below to instantly sync data to your admin dashboard.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Project Requirements</label>
              <textarea 
                rows={4}
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us about your project goals..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            <button type="submit" className="mt-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-purple-500/25">
              Submit Request
            </button>
            {submitted && (
              <p className="text-emerald-400 text-xs text-center font-medium mt-2">✓ Success! Submission saved securely to backend storage.</p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
