import { Menu, Sparkles, ArrowRight, Code2, ShieldCheck, Database, Layout, Cloud, Cpu, CheckCircle } from 'lucide-react'
import { CSSProperties, useEffect, useRef, useState, FormEvent } from 'react'

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const SPOTLIGHT_R = 260

type RevealLayerProps = { image: string; cursorX: number; cursorY: number }

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mask, setMask] = useState('none')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const drawMask = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const context = canvas.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      const gradient = context.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.beginPath()
      context.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
      context.fill()
      setMask(canvas.toDataURL())
    }

    drawMask()
    window.addEventListener('resize', drawMask)
    return () => window.removeEventListener('resize', drawMask)
  }, [cursorX, cursorY])

  const revealStyle: CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage: `url(${mask})`,
    WebkitMaskImage: `url(${mask})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
  }

  return <>
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
    <div className="absolute inset-0 z-30 pointer-events-none bg-center bg-cover bg-no-repeat" style={revealStyle} />
  </>
}

export default function App() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  // Backend Form State
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientname: '',
    email: '',
    serviceType: 'Static Website',
    estimatedBudget: 25000,
    projectDetails: ''
  })

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => { mouse.current = { x: event.clientX, y: event.clientY } }
    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://agency-backend-t8oq.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedBudget: Number(formData.estimatedBudget)
        })
      })

      if (response.ok || response.status === 200 || response.status === 201) {
        setSubmitted(true)
      } else {
        alert('Server error: ' + response.status)
      }
    } catch (err) {
      alert('Could not reach backend server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5" style={{ background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <a href="#top" className="flex items-center gap-2 text-white text-2xl font-bold tracking-tight text-decoration-none" style={{ textDecoration: 'none' }}>
          <Sparkles className="w-5 h-5 text-indigo-400" /> yezhuththu
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-gray-400 hover:text-white text-sm font-medium transition-colors" style={{ textDecoration: 'none' }}>Services</a>
          <a href="pricing.html" className="text-gray-400 hover:text-white text-sm font-medium transition-colors" style={{ textDecoration: 'none' }}>Pricing</a>
          <a href="admin.html" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors" style={{ textDecoration: 'none' }}>Admin Portal</a>
        </div>
        <a href="#quote" className="hidden md:inline-flex bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity" style={{ textDecoration: 'none' }}>Start Project</a>
        <button className="md:hidden p-2 text-white" aria-label="Open menu"><Menu size={25} strokeWidth={1.75} /></button>
      </nav>

      {/* Interactive Spotlight Hero Section */}
      <section id="top" className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${BG_IMAGE_1})` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
        
        <div className="absolute top-[20%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles size={14} /> Elite Web Engineering Studio
          </div>
          <h1 className="text-white leading-[1.05] max-w-4xl">
            <span className="block font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight">Architecting Digital Excellence</span>
            <span className="block font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">& Custom Web Systems</span>
          </h1>
        </div>

        <div className="absolute bottom-10 sm:bottom-16 left-5 sm:left-10 md:left-14 max-w-[280px] z-50">
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">We combine high-performance frontend engineering, robust backend infrastructure, and immersive design to scale your brand.</p>
        </div>

        <div className="absolute bottom-10 sm:bottom-16 right-5 sm:right-10 md:right-14 z-50">
          <a href="#quote" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
            Request Custom Quote <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" style={{ padding: '120px 8%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '12px' }}>Engineering Capabilities</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Built for performance, security, and enterprise scale.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Code2 />, title: "Custom Web Engineering", desc: "Hand-crafted architectures built using modern stacks for maximum speeds." },
            { icon: <ShieldCheck />, title: "Enterprise Security", desc: "Advanced data safeguards and compliance-ready pipelines." },
            { icon: <Database />, title: "Dynamic Backends", desc: "Scalable REST APIs and synchronized database architectures." },
            { icon: <Layout />, title: "UI/UX Brand Design", desc: "Immersive visual interfaces that capture attention and build trust." },
            { icon: <Cloud />, title: "Cloud DevOps", desc: "Automated deployment pipelines and 99.9% uptime infrastructure." },
            { icon: <Cpu />, title: "API Integrations", desc: "Seamless integration of payment gateways and third-party software." },
          ].map((s, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: '24px' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Backend Lead Form Section */}
      <section id="quote" style={{ padding: '40px 8% 120px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '32px', padding: '60px', backdropFilter: 'blur(30px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>Submit Project Inquiry</h2>
            <p style={{ color: '#94a3b8' }}>Fill out your details to transmit your requirements directly into our database.</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle style={{ width: '64px', color: '#10b981', marginBottom: '16px', display: 'inline-block' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px' }}>Inquiry Transmitted Successfully!</h3>
              <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Your project data has been saved to the backend database.</p>
              <a href="admin.html" style={{ background: '#6366f1', color: '#fff', padding: '12px 28px', borderRadius: '99px', textDecoration: 'none', fontWeight: 600 }}>View in Admin Dashboard</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Your Name</label>
                  <input type="text" required value={formData.clientname} onChange={e => setFormData({...formData, clientname: e.target.value})} placeholder="Jane Doe" style={{ width: '100%', padding: '14px 18px', background: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" style={{ width: '100%', padding: '14px 18px', background: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Service Required</label>
                  <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} style={{ width: '100%', padding: '14px 18px', background: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem' }}>
                    <option value="Static Website">Static Website</option>
                    <option value="Dynamic Enterprise">Dynamic Enterprise</option>
                    <option value="E-Commerce Solution">E-Commerce Solution</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Estimated Budget (₹)</label>
                  <input type="number" required value={formData.estimatedBudget} onChange={e => setFormData({...formData, estimatedBudget: Number(e.target.value)})} style={{ width: '100%', padding: '14px 18px', background: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Project Overview</label>
                <textarea rows={4} value={formData.projectDetails} onChange={e => setFormData({...formData, projectDetails: e.target.value})} placeholder="Describe your web development goals..." style={{ width: '100%', padding: '14px 18px', background: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }}></textarea>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none', borderRadius: '99px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}>
                {loading ? 'Transmitting to Server...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px 8%', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        <p>&copy; 2026 yezhuththu. All rights reserved. Powered by Spring Boot & React.</p>
      </footer>

    </div>
  )
}
