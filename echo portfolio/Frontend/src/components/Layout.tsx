import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CursorFollower from './CursorFollower';
import Lenis from 'lenis';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top on route change
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]);

  return (
    <>
      <CursorFollower />
      <div className="layout-container">
        <Navbar />
        <main className="container page-transition" style={{ flex: 1, width: '100%', paddingBottom: '2rem' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
