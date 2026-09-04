import { Menu, ArrowRight, CheckCircle2, Sparkles, Globe, Megaphone, Search } from 'lucide-react'
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
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })

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
      const px = (event.clientX / window.innerWidth - 0.5) * 35
      const py = (event.clientY / window.innerHeight - 0.5) * 35
      setParallaxOffset({ x: px, y: py })
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

  return (
    <main className="min-h-screen bg-black text-white tracking-[-0.02em] font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
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

      {/* Page 1: Pristine Spotlight Hero */}
      <section id="home" className="relative w-full h-screen bg-black flex items-center justify-center" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat opacity-90" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

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

      {/* Page 2: Services with Integrated Spotlight & Background Textures */}
      <section id="services" className="relative min-h-screen flex flex-col justify-center items-center px-6 py-32 bg-black overflow-hidden">
        {/* Same underlying imagery layout as Page 1 */}
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat opacity-60" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="relative z-40 max-w-6xl w-full text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-purple-300 font-semibold mb-3 block">What We Offer</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">Engineered for growth.</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-16 text-sm sm:text-base font-light">Comprehensive digital solutions built with enterprise grade precision.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="group bg-black/60 hover:bg-black/40 border border-white/20 hover:border-purple-400 p-8 rounded-3xl transition-all duration-500 backdrop-blur-2xl shadow-2xl hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">01. Website Building</h3>
              <p className="text-white/70 text-sm leading-relaxed font-light mb-6">Custom-designed web apps and immersive landing pages optimized for high conversion rates.</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <CheckCircle2 size={14} /> Custom Architecture
              </div>
            </div>

            <div className="group bg-black/60 hover:bg-black/40 border border-white/20 hover:border-indigo-400 p-8 rounded-3xl transition-all duration-500 backdrop-blur-2xl shadow-2xl hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform">
                <Megaphone size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">02. Digital Marketing</h3>
              <p className="text-white/70 text-sm leading-relaxed font-light mb-6">Targeted multichannel campaigns designed around your exact value proposition.</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <CheckCircle2 size={14} /> Conversion Focused
              </div>
            </div>

            <div className="group bg-black/60 hover:bg-black/40 border border-white/20 hover:border-pink-400 p-8 rounded-3xl transition-all duration-500 backdrop-blur-2xl shadow-2xl hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 mb-6 group-hover:scale-110 transition-transform">
                <Search size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">03. SEO & Technical</h3>
              <p className="text-white/70 text-sm leading-relaxed font-light mb-6">Structural optimization, lightning-fast speed audits, and organic traffic expansion.</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
                <CheckCircle2 size={14} /> Organic Authority
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page 3: Contact with Integrated Spotlight & Background Textures */}
      <section id="contact" className="relative min-h-screen flex flex-col justify-center items-center px-6 py-32 bg-black overflow-hidden">
        {/* Same underlying imagery layout as Page 1 */}
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat opacity-60" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="relative z-40 w-full max-w-xl bg-black/70 border border-white/20 p-8 sm:p-12 rounded-3xl backdrop-blur-3xl shadow-2xl">
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
