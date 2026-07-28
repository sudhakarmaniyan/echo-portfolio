import { motion } from 'framer-motion';
import { Target, MapPin, Code, Briefcase, Sparkles, Globe } from 'lucide-react';
import TiltedCard from '../TiltedCard';
import './AboutSection.css';

export default function AboutSection() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="section" style={{ perspective: '1000px', paddingTop: '6rem' }}>
      
      <div style={{ marginBottom: '4rem' }}>
        <span className="hero-subtitle">About Us</span>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem', marginTop: '0.5rem', lineHeight: 1.1 }}>
          Driven by Innovation.
        </h3>
      </div>

      <motion.div
        className="bento-grid-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Box 1: Our Mission */}
        <motion.div className="bento-item bento-mission" variants={itemVariants}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h4 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={28} color="#a855f7" /> Our Mission
            </h4>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '90%' }}>
              We don't just build websites; we craft digital ecosystems. Our team of designers and engineers work in unison to push the boundaries of what's possible on the web, bridging the gap between aesthetics and scalable architecture.
            </p>
          </div>
          <Sparkles style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '150px', height: '150px', opacity: 0.05, color: '#a855f7' }} />
        </motion.div>

        {/* Box 2: CEO Profile */}
        <motion.div className="bento-ceo" variants={itemVariants}>
          <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden' }}>
            <TiltedCard
              imageSrc="/boopathy-echo-ceo.jpg"
              altText="CEO Profile"
              captionText="Our CEO"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.02}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Boopathy</h3>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>Founder & CEO</p>
                </div>
              }
            />
          </div>
        </motion.div>

        {/* Box 3: Location */}
        <motion.div className="bento-item bento-location" variants={itemVariants}>
          <MapPin size={32} color="#3b82f6" style={{ marginBottom: '1.5rem' }} />
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', fontWeight: 600 }}>Global HQ</p>
            <h4 style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '-0.5px' }}>Chennai, India</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
               <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Serving Clients Globally</span>
            </div>
          </div>
        </motion.div>

        {/* Box 4: By The Numbers */}
        <motion.div className="bento-item bento-stats" variants={itemVariants}>
           <Briefcase size={32} color="#f59e0b" style={{ marginBottom: '1.5rem' }} />
           <div>
             <h4 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontFamily: "'Playfair Display', serif", color: 'var(--accent-purple)' }}>5+</h4>
             <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Years Experience</p>
             <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Delivering high-performance digital solutions.</p>
           </div>
        </motion.div>

        {/* Box 5: Core Technologies */}
        <motion.div className="bento-item bento-item-dark bento-tech" variants={itemVariants}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff' }}>
              <Code size={24} color="#a855f7" /> Core Technologies
            </h4>
            <Globe size={24} opacity={0.2} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto' }}>
            {['React', 'Node.js', 'TypeScript', 'Next.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'].map(tech => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
