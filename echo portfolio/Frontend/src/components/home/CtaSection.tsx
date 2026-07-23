import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section id="contact" className="section" style={{ paddingBottom: '2rem', paddingTop: '4rem', perspective: '1000px' }}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, rotateX: -20, scale: 0.95 }}
        whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '6rem 2rem',
          borderRadius: '30px',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          background: 'linear-gradient(135deg, #fff, #a881d2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          textShadow: '0 4px 30px rgba(168, 85, 247, 0.3)'
        }}>
          Ready to stand out?
        </h2>
        <p className="mx-auto" style={{ maxWidth: '700px', fontSize: '1.25rem', marginBottom: '3rem', color: '#aaa' }}>
          Let's build something extraordinary together. Earn more customers and outshine your competitors.
        </p>
        <Link to="/contact" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1.2rem 3.5rem',
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '40px',
              background: 'white',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            Start a Project <ArrowRight size={20} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
