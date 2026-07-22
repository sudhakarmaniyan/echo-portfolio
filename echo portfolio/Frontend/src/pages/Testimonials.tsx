import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  author_name: string;
  role: string;
  content: string;
  avatar_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error('Failed to fetch testimonials', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" style={{ perspective: '1000px' }}>
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Client Love</span>
        <h2>What They Say.</h2>
        <p className="mx-auto" style={{ maxWidth: '600px' }}>
          Don't just take our word for it. Read what our partners have to say about working with us.
        </p>
      </motion.div>

      <div className="grid testimonials-grid">
        {loading ? (
          <p className="text-center w-full col-span-full">Loading testimonials...</p>
        ) : (
          [
            { id: 991, author_name: 'Sarah Jenkins', role: 'CEO at TechNova', content: 'Echo transformed our brand identity. Their attention to detail and design aesthetics are unmatched.', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
            { id: 992, author_name: 'David Chen', role: 'Founder of DesignCo', content: 'Working with Echo was an absolute pleasure. They delivered a high-performance web app that our users love.', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
            { id: 993, author_name: 'Emma Williams', role: 'Marketing Director', content: 'Our conversion rates doubled after Echo redesigned our landing pages. Truly a phenomenal digital agency.', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
          ].map((t, i) => (
            <motion.div 
              key={t.id} 
              className="testimonial-card glass-panel"
              initial={{ opacity: 0, rotateY: 30, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 8, 
                rotateX: -5,
                z: 50,
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)"
              }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Quote 
                className="quote-icon" 
                size={32} 
                style={{ color: '#F59E0B', opacity: 0.4 }} 
              />
              <div className="stars">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="testimonial-content">"{t.content}"</p>
              <div className="testimonial-author">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.author_name} />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eee' }}></div>
                )}
                <div>
                  <h4>{t.author_name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
