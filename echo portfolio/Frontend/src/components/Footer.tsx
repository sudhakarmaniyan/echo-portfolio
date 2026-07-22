import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Echo Digital Works Logo" 
                style={{ 
                  height: '45px', 
                  width: 'auto',
                  objectFit: 'contain'
                }} 
              />
            </div>
            <p>Crafting immersive digital experiences that push boundaries.</p>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <Link to="/about">About Us</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons" style={{ marginBottom: '2rem' }}>
              <a href="#" aria-label="Website"><Globe /></a>
              <a href="#" aria-label="Contact"><Mail /></a>
              <a href="#" aria-label="Phone"><Phone /></a>
              <a href="#" aria-label="Chat"><MessageSquare /></a>
            </div>

            <motion.div
              style={{ display: 'inline-block', perspective: '1000px' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                whileHover={{ rotateX: 15, rotateY: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link 
                  to="/contact" 
                  className="hover-target"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6', // Bright blue color matching the screenshot
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  Get in touch
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Echo Digital Works. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
