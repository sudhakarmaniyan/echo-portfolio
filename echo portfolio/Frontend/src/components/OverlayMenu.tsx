import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

interface OverlayMenuProps {
  showButton: boolean;
  navLinks: { name: string; path: string }[];
  socialLinks: { name: string; url: string }[];
}

export default function OverlayMenu({ showButton, navLinks, socialLinks }: OverlayMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const menuVars = {
    initial: { x: '100%' },
    animate: { x: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: { x: '100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const linkVars = {
    initial: { y: '50px', rotate: 5, opacity: 0 },
    animate: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: { y: '50px', rotate: 5, opacity: 0, transition: { duration: 0.4 } }
  };

  const containerVars = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  return (
    <>
      <div 
        className="mobile-only"
        style={{
          position: 'fixed',
          top: '2rem',
          right: '5%',
          zIndex: 1010,
          opacity: showButton || isOpen ? 1 : 0,
          pointerEvents: showButton || isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover-target"
          style={{
            background: isOpen ? '#3b60e4' : '#1c1d20',
            border: 'none',
            borderRadius: '50%',
            width: '65px',
            height: '65px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: 'clamp(380px, 45vw, 650px)',
              height: '100vh',
              background: '#1c1d20',
              zIndex: 1005,
              padding: '6rem 4rem 3rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 500, margin: 0, textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>Navigation</p>
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0 2.5rem 0' }} />
              
              <motion.div variants={containerVars} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <div key={link.name} style={{ overflow: 'hidden' }}>
                      <motion.div variants={linkVars} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: '#fff', 
                          borderRadius: '50%', 
                          marginRight: '1.5rem',
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'scale(1)' : 'scale(0)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }} />
                        <Link 
                          to={link.path}
                          className="hover-target"
                          style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 400,
                            fontFamily: '"Outfit", "Inter", sans-serif',
                            lineHeight: 1.2,
                            letterSpacing: '-1px',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#3b60e4';
                            const dot = e.currentTarget.previousSibling as HTMLDivElement;
                            if (!isActive && dot) {
                              dot.style.opacity = '1';
                              dot.style.transform = 'scale(1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#fff';
                            const dot = e.currentTarget.previousSibling as HTMLDivElement;
                            if (!isActive && dot) {
                              dot.style.opacity = '0';
                              dot.style.transform = 'scale(0)';
                            }
                          }}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', flexShrink: 0 }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 500, margin: '0 0 1rem 0', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>Socials</p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-target"
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 400,
                      fontFamily: '"Inter", sans-serif',
                      transition: 'opacity 0.2s ease',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
