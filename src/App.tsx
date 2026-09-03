import React, { useState } from 'react';
import { Sparkles, ArrowRight, Code2, ShieldCheck, Database, Layout, Cloud, Cpu, CheckCircle } from 'lucide-react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientname: '',
    email: '',
    serviceType: 'Static Website',
    estimatedBudget: 25000,
    projectDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://agency-backend-t8oq.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedBudget: Number(formData.estimatedBudget)
        })
      });

      if (response.ok || response.status === 200 || response.status === 201) {
        setSubmitted(true);
      } else {
        alert('Server error: ' + response.status);
      }
    } catch (err) {
      alert('Could not reach backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 1000 }}>
        <a href="#" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles style={{ color: '#818cf8', width: '22px' }} /> yezhuththu
        </a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Services</a>
          <a href="pricing.html" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
          <a href="admin.html" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Admin Portal</a>
          <a href="#quote" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', padding: '10px 24px', borderRadius: '99px', fontWeight: 600, textDecoration: 'none' }}>Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '160px 8% 80px', background: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #020617 75%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '99px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px' }}>
          <Sparkles style={{ width: '14px' }} /> Premium Web Engineering Studio
        </div>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, maxWidth: '900px', marginBottom: '24px', letterSpacing: '-2px' }}>
          Crafting <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Masterpieces</span> & Web Systems
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '650px', marginBottom: '40px', lineHeight: 1.6 }}>
          We architect ultra-fast, visually breathtaking, and secure websites that scale your digital footprint effortlessly.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="#quote" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', padding: '14px 32px', borderRadius: '99px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
            Start Your Project <ArrowRight style={{ width: '18px' }} />
          </a>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" style={{ padding: '120px 8%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '12px' }}>Engineering Capabilities</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Built for performance, scalability, and conversion.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Code2 />, title: "Custom Web Development", desc: "Hand-crafted architectures built using modern stacks for lightning-fast speeds." },
            { icon: <ShieldCheck />, title: "Enterprise Security", desc: "Advanced data safeguards, SSL pipelines, and high-tier compliance standards." },
            { icon: <Database />, title: "Robust Backends", desc: "Scalable REST APIs and synchronized real-time data backends." },
            { icon: <Layout />, title: "Immersive UI/UX", desc: "Tailored visual designs that capture attention and build immediate brand trust." },
            { icon: <Cloud />, title: "Cloud DevOps", desc: "Automated deployment pipelines and 99.9% uptime infrastructure." },
            { icon: <Cpu />, title: "API Integrations", desc: "Seamless integration of payment gateways, CRMs, and custom software." },
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

      {/* Inquiry Form Section */}
      <section id="quote" style={{ padding: '40px 8% 120px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '32px', padding: '60px', backdropFilter: 'blur(30px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>Submit Project Inquiry</h2>
            <p style={{ color: '#94a3b8' }}>Fill out your requirements below to connect directly with our engineering team.</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle style={{ width: '64px', color: '#10b981', marginBottom: '16px' }} />
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
  );
}
