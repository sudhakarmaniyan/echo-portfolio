import { motion } from 'framer-motion';
import { Target, Zap, Users } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="section" style={{ perspective: '1000px', paddingTop: '6rem' }}>
      <motion.div
        className="about-grid"
        initial={{ opacity: 0, rotateX: 30, y: 100 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="glass-panel about-image"
          whileHover={{ rotateY: 10, rotateX: -10, scale: 1.02, zIndex: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ transformStyle: 'preserve-3d', cursor: 'grab' }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
            alt="Team collaborating"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
          />
        </motion.div>
        <div className="about-content">
          <span className="hero-subtitle">About Us</span>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem', marginTop: '0.5rem', lineHeight: 1.1 }}>Driven by Innovation.</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            We don't just build websites; we craft digital ecosystems. Our team of
            designers and engineers work in unison to push the boundaries of what's
            possible on the web.
          </p>

          <div className="feature-list mt-8">
            <div className="feature-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                <Zap size={24} color="#a855f7" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Cutting-Edge Tech</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We leverage the latest frameworks for blazing fast performance.</p>
              </div>
            </div>
            <div className="feature-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                <Target size={24} color="#3b82f6" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Strategic Design</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Every pixel serves a purpose in our conversion-focused designs.</p>
              </div>
            </div>
            <div className="feature-item" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                <Users size={24} color="#a855f7" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Collaborative Process</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We work with you, not just for you, throughout the entire journey.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
