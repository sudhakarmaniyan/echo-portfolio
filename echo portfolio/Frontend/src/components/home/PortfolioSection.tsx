import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// @ts-ignore
import GradientText from '../GradientText';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Show up to 7 projects in the folder
          setProjects(data.slice(0, 7));
        }
      })
      .catch(err => console.error('Failed to fetch projects', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="portfolio" className="section" style={{ perspective: '1000px', width: '100%' }}>
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Our Portfolio</span>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-2px', lineHeight: 1.2, marginBottom: '2rem', fontWeight: 700 }}>
          We provide the <GradientText colors={['#FF6B6B', '#4facfe', '#a881d2', '#FF6B6B']} animationSpeed={6} className="inline-gradient">Perfect Solution</GradientText><br />to your business growth
        </h2>
      </motion.div>

      {loading ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>Check the admin dashboard to add real projects here.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0 4rem 0', width: '100%' }}>
          <div style={{ width: '100%', maxWidth: '1200px', padding: '0 2rem' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={projects.length > 3}
              pagination={{ clickable: true }}
              style={{ paddingBottom: '4rem' }}
            >
              {projects.map((p) => (
                <SwiperSlide key={p.id} style={{ height: 'auto' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      padding: '1.2rem',
                      boxSizing: 'border-box',
                      backgroundColor: '#1B1722',
                      border: '1px solid #555',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1.2rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
                      <img 
                        src={p.image_url} 
                        alt={p.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#fff', fontWeight: '700' }}>{p.title}</h3>
                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                      {p.description}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.live_url) window.open(p.live_url, '_blank', 'noopener,noreferrer');
                        }}
                        style={{
                          background: '#fff',
                          color: '#111',
                          border: 'none',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#eee'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                      >
                        View Site <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          <button 
            onClick={() => window.location.href = '/portfolio'}
            className="hover-target"
            style={{
              marginTop: '4rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--text-color, #111)',
              color: 'var(--bg-color, #fff)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            More Work <ArrowRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
