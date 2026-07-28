import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import OverlayMenu from './OverlayMenu';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const fullNavLinks = [
    { name: 'Home', path: '/#hero' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/#portfolio' },
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'Packages', path: '/#packages' },
    { name: 'Contact', path: '/#contact' },
  ];

  const constantLinks = [
    { name: 'Home', path: '/#hero' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/#portfolio' },
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'Packages', path: '/#packages' },
    { name: 'Contact', path: '/#contact' },
  ];

  // Show floating hamburger menu when scrolling up
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // removed showFloatingNav logic
      
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Check if mobile view for permanent solid navbar
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isHomePage = location.pathname === '/';
  // If on mobile, never make it white/transparent so it's always visible
  const shouldBeWhite = isHomePage && !isScrolled && !isMobile;
  const isSolid = isScrolled || !isHomePage || isMobile;

  return (
    <>
      <header 
        className={`navbar ${isSolid ? 'scrolled' : ''}`}
        style={{
          background: isSolid ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: isSolid ? 'blur(10px)' : 'none',
          boxShadow: isSolid ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none',
          borderBottom: isSolid ? '1px solid rgba(0,0,0,0.05)' : 'none',
          transition: 'all 0.3s ease',
          padding: isScrolled ? '1rem 5%' : '1.5rem 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
      >
        <div className="logo">
          <a href={isHomePage ? "#hero" : "/"} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo.png" 
              alt="Echo Digital Works" 
              style={{ 
                height: isScrolled ? '50px' : '85px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: shouldBeWhite 
                  ? 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' 
                  : 'brightness(0)',
                transition: 'all 0.3s ease'
              }} 
            />
          </a>
        </div>
        
        {/* Desktop Constant Nav */}
        <div className="constant-nav desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
          <GooeyNav 
            items={constantLinks.map(link => ({ label: link.name, href: link.path }))}
          />
        </div>

        {/* Mobile Header Nav Trigger */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover-target"
            style={{
              background: 'transparent',
              border: 'none',
              color: shouldBeWhite ? '#fff' : '#1c1d20',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.5rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <OverlayMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navLinks={fullNavLinks}
        socialLinks={[
          { name: 'Twitter', url: 'https://twitter.com' },
          { name: 'GitHub', url: 'https://github.com' },
          { name: 'LinkedIn', url: 'https://linkedin.com' }
        ]}
      />
    </>
  );
}
