import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Import all home sections
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import PortfolioSection from '../components/home/PortfolioSection';
import ServicesSection from '../components/home/ServicesSection';
import SubscribeSection from '../components/home/SubscribeSection';
import CtaSection from '../components/home/CtaSection';

// Keep existing components
import Testimonials from './Testimonials';
import Packages from './Packages';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // small delay to ensure rendering
    }
  }, [location.hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ perspective: '1000px' }}
    >
      <HeroSection />

      {/* Stacked Card Wrapper for everything below the hero */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--bg-color)',
        borderTopLeftRadius: '40px',
        borderTopRightRadius: '40px',
        marginTop: '80px',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.08)',
        width: '100%'
      }}>
        <div className="container">
          <AboutSection />
          <PortfolioSection />
          <ServicesSection />
        </div> {/* End of white container */}

        <Testimonials />

        <div className="container">
          <Packages />
        </div>

        {/* Dark Mode Finale */}
        <div style={{
          backgroundColor: '#0a0a0c',
          color: '#ffffff',
          borderTopLeftRadius: '60px',
          borderTopRightRadius: '60px',
          padding: '8rem 0 8rem 0',
          marginTop: '4rem',
          marginBottom: '-4rem',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.2)'
        }}>
          <div className="container">
            <SubscribeSection />
            <CtaSection />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
