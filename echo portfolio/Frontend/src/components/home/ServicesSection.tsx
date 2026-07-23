import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Code, Palette, ArrowRight } from 'lucide-react';

const servicesData = [
  {
    id: '01',
    title: 'UI/UX Design',
    subtitle: 'Strategic & conversion-focused',
    description: 'We design intuitive and stunning interfaces that engage users and drive conversions. Every pixel is placed with purpose.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    icon: <Monitor size={32} strokeWidth={1.5} />,
    color: '#FF6B6B'
  },
  {
    id: '02',
    title: 'Web Development',
    subtitle: 'Blazing fast & scalable',
    description: 'Our engineers build robust, scalable, and lightning-fast applications using the latest modern web technologies.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
    icon: <Code size={32} strokeWidth={1.5} />,
    color: '#4facfe'
  },
  {
    id: '03',
    title: 'Brand Identity',
    subtitle: 'Stand out from the crowd',
    description: 'We craft unique digital identities that tell your story and resonate deeply with your target audience.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1200',
    icon: <Palette size={32} strokeWidth={1.5} />,
    color: '#a881d2'
  }
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section id="services" className="section" style={{ perspective: '1000px', paddingBottom: '8rem' }}>
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Our Expertise</span>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-2px' }}>What We Do Best</h2>
        <p className="mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
          We craft digital ecosystems that push the boundaries of what's possible on the web.
        </p>
      </motion.div>

      {/* Interactive Expanding Accordion */}
      <div 
        style={{ 
          display: 'flex', 
          height: '650px', 
          gap: '1rem',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}
      >
        {servicesData.map((service, index) => {
          const isActive = hoveredIndex === index;
          
          return (
            <motion.div
              key={service.id}
              onHoverStart={() => setHoveredIndex(index)}
              animate={{ 
                width: isActive ? '60%' : '20%',
                opacity: 1
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                borderRadius: '30px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--bg-alt)',
                boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {/* Background Image */}
              <motion.div
                animate={{ scale: isActive ? 1.05 : 1.2 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: isActive ? 'brightness(0.6)' : 'brightness(0.2) grayscale(0.8)',
                }}
              />
              
              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isActive 
                  ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)`
                  : 'rgba(0,0,0,0.5)',
                transition: 'background 0.5s ease'
              }} />

              {/* Content Container */}
              <div style={{
                position: 'absolute',
                inset: 0,
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white',
              }}>
                {/* Top Section: Number and Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <motion.div 
                    animate={{ color: isActive ? service.color : 'rgba(255,255,255,0.3)' }}
                    style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'monospace' }}
                  >
                    {service.id}
                  </motion.div>
                  <motion.div 
                    animate={{ 
                      backgroundColor: isActive ? service.color : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)'
                    }}
                    style={{ 
                      padding: '1rem', 
                      borderRadius: '50%',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {service.icon}
                  </motion.div>
                </div>

                {/* Bottom Section: Title and Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ transform: isActive ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease' }}>
                    <motion.p 
                      animate={{ color: isActive ? service.color : 'rgba(255,255,255,0.6)' }}
                      style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 500, marginBottom: '0.5rem' }}
                    >
                      {service.subtitle}
                    </motion.p>
                    <h3 style={{ fontSize: isActive ? 'clamp(2rem, 3vw, 3rem)' : '1.5rem', color: '#fff', margin: 0, whiteSpace: 'nowrap', transition: 'font-size 0.5s ease' }}>
                      {service.title}
                    </h3>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '80%', lineHeight: 1.6, margin: '1rem 0' }}>
                          {service.description}
                        </p>
                        
                        <motion.button
                          whileHover={{ gap: '1rem' }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 600,
                            padding: '0.5rem 0',
                            cursor: 'pointer',
                            marginTop: '1rem'
                          }}
                        >
                          Explore Service <ArrowRight size={18} color={service.color} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
