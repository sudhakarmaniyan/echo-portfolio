import { motion } from 'framer-motion';
import { Code, MapPin, Sparkles, Briefcase } from 'lucide-react';

export default function BentoAboutSection() {
  return (
    <section id="bento-about" className="section" style={{ perspective: '1000px', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span className="hero-subtitle">Alternative Concept</span>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}>The Bento Box Layout</h3>
        <p style={{ color: 'var(--text-secondary)' }}>A trendy, highly interactive grid displaying your professional life.</p>
      </div>

      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          gridAutoRows: '220px',
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
      >
        {/* Main Bio Card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h4 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles className="text-purple-500" /> Full Stack Developer
            </h4>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6 }}>
              I craft scalable digital ecosystems. With a deep understanding of both front-end aesthetics and back-end architecture, I bridge the gap between design and engineering to build products that are not just functional, but exceptional.
            </p>
          </div>
          <Sparkles style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '200px', height: '200px', opacity: 0.05, color: '#a855f7' }} />
        </motion.div>

        {/* Location Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
          style={{
            background: 'var(--bg-secondary, #f8fafc)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <MapPin size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Based In</p>
            <h4 style={{ fontSize: '1.3rem', margin: 0 }}>Chennai, India</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available for Remote</span>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
          style={{
            background: '#0a0a0c', // Dark card for contrast
            color: 'white',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <Code size={32} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>Core Stack</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
            {['React', 'Node.js', 'TypeScript', 'Next.js', 'MongoDB'].map(tech => (
              <span key={tech} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Experience Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
          style={{
            background: 'var(--bg-secondary, #f8fafc)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
           <Briefcase size={32} color="#f59e0b" style={{ marginBottom: '1rem' }} />
           <div>
             <h4 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>5+ Years Exp.</h4>
             <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Delivering high-performance applications for global clients.</p>
           </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
