import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutDashboard, Search, MonitorSmartphone, Code2, PenTool, Globe, Server, Database, Smartphone, Megaphone, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IconMap: Record<string, any> = {
  LayoutDashboard, Search, MonitorSmartphone, Code2, PenTool, Globe, Server, Database, Smartphone, Megaphone, Zap
};

export default function ProvidedServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      .catch(err => console.error("Failed to load services", err));
  }, []);

  useEffect(() => {
    if (services.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [services.length]);

  const handleExplore = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/service/${id}`);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const ServiceCard = ({ service, isMobile }: { service: any, isMobile: boolean }) => (
    <div 
      onClick={(e) => handleExplore(e, service.id)}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '420px', 
        width: '100%', 
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
      onMouseEnter={(e) => { if (!isMobile) e.currentTarget.style.transform = 'translateY(-10px)' }}
      onMouseLeave={(e) => { if (!isMobile) e.currentTarget.style.transform = 'translateY(0)' }}
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
          onClick={(e) => handleExplore(e, service.id)}
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
  );

  const extendedServices = [...services, ...services];

  return (
    <section id="provided-services" className="section" style={{ paddingBottom: '8rem', position: 'relative' }}>
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Services</span>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-2px' }}>Services We Provide</h2>
        <p className="mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem', marginBottom: '4rem' }}>
          Discover our full range of tailored digital solutions designed to elevate your business.
        </p>

        {services.length > 0 && (
          <>
            {/* Desktop View: Carousel (3 cards) */}
            <div className="desktop-only" style={{ overflow: 'hidden', padding: '1rem 0' }}>
              <div style={{ 
                display: 'flex', 
                gap: '2rem',
                transition: currentIndex === 0 ? 'none' : 'transform 0.5s ease-in-out',
                transform: `translateX(calc(-${currentIndex} * (33.333% + 0.666rem)))` 
              }}>
                {extendedServices.map((service, idx) => (
                  <div key={`${service.id}-${idx}`} style={{ flex: '0 0 calc(33.333% - 1.333rem)' }}>
                    <ServiceCard service={service} isMobile={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View: Carousel (1 card) */}
            <div className="mobile-only" style={{ overflow: 'hidden', padding: '1rem 0' }}>
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                transition: currentIndex === 0 ? 'none' : 'transform 0.5s ease-in-out',
                transform: `translateX(calc(-${currentIndex} * (100% + 1rem)))` 
              }}>
                {extendedServices.map((service, idx) => (
                  <div key={`mob-${service.id}-${idx}`} style={{ flex: '0 0 100%' }}>
                    <ServiceCard service={service} isMobile={true} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div style={{ marginTop: '4rem' }}>
          <button onClick={() => navigate('/services')} className="btn-pill hover-target">
            View All Services
          </button>
        </div>
      </motion.div>
    </section>
  );
}
