import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface MagneticNavLinkProps {
  to: string;
  label: string;
  isActive?: boolean;
}

export default function MagneticNavLink({ to, label, isActive }: MagneticNavLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // reduce the magnetic pull slightly for text
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      style={{ position: 'relative', display: 'inline-block' }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Link
        ref={ref}
        to={to}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className="magnetic-nav-link hover-target"
        style={{
          display: 'inline-block',
          padding: '1rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.05rem',
          fontWeight: 500,
          position: 'relative'
        }}
      >
        {label}
        {/* Dot indicator under text */}
        <motion.div
          initial={false}
          animate={{
            scale: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            bottom: '0.4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'var(--text-primary)'
          }}
        />
      </Link>
    </motion.div>
  );
}
