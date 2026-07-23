import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { servicesData } from '../data/services';

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const service = servicesData.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!service) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Service not found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', overflow: 'hidden', paddingTop: '100px' }}>
      <div className="container" style={{ perspective: '2000px', padding: '2rem' }}>
        
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/#services')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-color)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={24} /> Back
        </motion.button>

        <div 
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ opacity: 0, rotateX: 60, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              background: `linear-gradient(135deg, var(--bg-alt) 0%, rgba(255,255,255,0.05) 100%)`,
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: '30px',
              padding: '4rem',
              maxWidth: '800px',
              width: '100%',
              boxShadow: `0 30px 60px rgba(0,0,0,0.3), 0 0 40px ${service.color}33`,
              position: 'relative'
            }}
          >
            {/* 3D Floating Elements */}
            <motion.div 
              style={{ 
                position: 'absolute', 
                top: '-40px', 
                right: '-40px', 
                transform: 'translateZ(100px)',
                background: service.color,
                borderRadius: '50%',
                padding: '1.5rem',
                color: 'white',
                boxShadow: `0 20px 40px ${service.color}66`
              }}
            >
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 48, strokeWidth: 2 })}
            </motion.div>

            <motion.span 
              style={{ 
                display: 'block',
                fontSize: '6rem', 
                fontWeight: 900, 
                color: service.color,
                opacity: 0.1,
                position: 'absolute',
                top: '20px',
                left: '20px',
                transform: 'translateZ(50px)',
                pointerEvents: 'none'
              }}
            >
              {service.id}
            </motion.span>

            {/* Content */}
            <motion.div style={{ transform: 'translateZ(60px)', position: 'relative', zIndex: 1 }}>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px', color: service.color, marginBottom: '1rem', fontWeight: 600 }}>
                {service.subtitle}
              </h4>
              <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '2rem', lineHeight: 1.1, letterSpacing: '-2px' }}>
                {service.title}
              </h1>
              <p style={{ fontSize: '1.5rem', lineHeight: 1.6, color: 'var(--text-color)', opacity: 0.8, maxWidth: '600px' }}>
                {service.description}
              </p>
              
              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                <button style={{
                  padding: '1rem 2rem',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  backgroundColor: service.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: `0 10px 20px ${service.color}44`
                }}>
                  Start a Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
