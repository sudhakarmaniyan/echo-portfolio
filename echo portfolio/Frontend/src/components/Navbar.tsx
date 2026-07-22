import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import MagneticNavLink from './MagneticNavLink';
import OverlayMenu from './OverlayMenu';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const location = useLocation();

  const fullNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Packages', path: '/packages' },
    { name: 'Contact', path: '/contact' },
  ];

  const constantLinks = [
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  // Show floating hamburger menu when scrolling up
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up and past a small threshold
      if (currentScrollY < lastScrollY.current && currentScrollY > 50) {
        setShowFloatingNav(true);
      } 
      // Hide when scrolling down or at the top
      else if (currentScrollY > lastScrollY.current || currentScrollY <= 50) {
        setShowFloatingNav(false);
      }
      
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

  return (
    <>
      <header className="navbar">
        <div className="logo">
          {location.pathname === '/' && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Echo Digital Works Logo" 
                style={{ 
                  height: '80px', 
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </div>
          )}
        </div>
        
        {/* Desktop Constant Nav */}
        <div className="constant-nav desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
          <GooeyNav 
            items={constantLinks.map(link => ({ label: link.name, href: link.path }))}
          />
        </div>
      </header>

      <OverlayMenu
        showButton={showFloatingNav}
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
