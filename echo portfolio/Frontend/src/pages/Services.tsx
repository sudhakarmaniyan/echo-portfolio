import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, Search, MonitorSmartphone, Code2, PenTool, Globe, Server, Database, Smartphone, Megaphone, Zap } from 'lucide-react';

const IconMap: Record<string, any> = {
  LayoutDashboard, Search, MonitorSmartphone, Code2, PenTool, Globe, Server, Database, Smartphone, Megaphone, Zap
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const processed = data.map(s => {
            const IconComp = IconMap[s.icon] || LayoutDashboard;
            return { ...s, icon: <IconComp /> };
          });
          setServices(processed);
        }
      })
      .catch(err => console.error("Failed to load services", err))
      .finally(() => setLoading(false));
  }, []);

  const handleExplore = (id: string) => {
    navigate(`/service/${id}`);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="page-animate section portfolio-page">
      <div className="container" style={{ paddingTop: '60px' }}>
        <h1 className="portfolio-main-title giant-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.3, marginBottom: '2rem' }}>
          Our <span className="text-accent">Services</span>
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '4rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          We craft digital ecosystems that push the boundaries of what's possible on the web. Explore what we do best.
        </p>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>No services found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => handleExplore(service.id)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '420px', 
                  boxSizing: 'border-box',
                  fontFamily: 'sans-serif',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: `1px solid ${service.color || '#3b60e4'}20`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '45%', backgroundImage: `url(${getImageUrl(service.bg_image)})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: service.color || '#3b60e4', background: '#ffffff', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px rgba(0,0,0,0.1)` }}>
                    {React.cloneElement(service.icon as React.ReactElement<any>, { size: 20 })}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '55%', textAlign: 'left', backgroundColor: '#ffffff' }}>
                  <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', textTransform: 'uppercase', letterSpacing: '2px', color: '#666', marginBottom: '0.25rem' }}>
                    {service.subtitle || 'Service'}
                  </div>
                  <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.35rem)', fontWeight: 'bold', color: '#111', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    {service.title}
                  </div>
                  <p style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#444', lineHeight: 1.5, margin: '0 0 auto 0' }}>
                    {service.description.length > 80 ? service.description.substring(0, 80) + '...' : service.description}
                  </p>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleExplore(service.id); }}
                    style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      background: service.color || '#3b60e4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      padding: '0.6rem 1rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: 'fit-content',
                      transition: 'opacity 0.2s',
                      marginTop: '1rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Explore Service <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
