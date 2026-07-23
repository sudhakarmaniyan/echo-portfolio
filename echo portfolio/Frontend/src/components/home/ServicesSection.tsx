import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stack from '../Stack';
import { servicesData } from '../../data/services';

export default function ServicesSection() {
  const [services, setServices] = useState(servicesData);
  const navigate = useNavigate();

  // NOTE: Prepared for future admin feature
  // Admin will be able to add new expertise through the admin panel.
  // This can be hooked up to your backend API like this:
  /*
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Failed to load services", err));
  }, []);
  */

  const handleExplore = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/service/${id}`);
  };

  return (
    <section id="services" className="section" style={{ paddingBottom: '8rem' }}>
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Our Expertise</span>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-2px' }}>What We Do Best</h2>
        <p className="mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem', marginBottom: '4rem' }}>
          We craft digital ecosystems that push the boundaries of what's possible on the web.
        </p>

        {/* Stack component replacing the old accordion/folder */}
        <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '320px', height: '420px', position: 'relative' }}>
            <Stack 
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={true}
              autoplay={false}
              cards={services.map((service) => (
                <div 
                  key={service.id}
                  onClick={(e) => handleExplore(e, service.id)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    height: '100%', 
                    width: '100%', 
                    padding: '2rem',
                    boxSizing: 'border-box',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer',
                    background: '#111',
                    borderRadius: '1rem',
                    border: `1px solid ${service.color}40`,
                    boxShadow: `0 10px 30px ${service.color}20`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: service.color, opacity: 0.8 }}>{service.id}</span>
                    <div style={{ color: service.color }}>
                      {React.cloneElement(service.icon as React.ReactElement, { size: 36 })}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '0.5rem' }}>
                      {service.subtitle}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                      {service.title}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#aaa', lineHeight: 1.5, margin: 0 }}>
                      {service.description}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => handleExplore(e, service.id)}
                    style={{ 
                      fontSize: '1rem', 
                      fontWeight: 600,
                      background: service.color, 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '0.75rem 1.25rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: 'fit-content',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Explore <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
