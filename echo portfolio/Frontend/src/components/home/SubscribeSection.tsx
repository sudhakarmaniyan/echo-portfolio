import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

function MagneticButton({ children, ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default function SubscribeSection() {
  return (
    <section className="section text-center">
      <span className="hero-subtitle" style={{ color: '#888' }}>SUBSCRIBE</span>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem', color: '#fff' }}>
        Stay In The Loop
      </h2>
      <p className="mx-auto" style={{ maxWidth: '600px', marginBottom: '3rem', color: '#aaa' }}>
        Join our newsletter for the latest insights in digital design and engineering.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}
        className="mx-auto"
        style={{
          display: 'flex',
          maxWidth: '550px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50px',
          padding: '0.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: '1rem 1.5rem',
            fontSize: '1.05rem',
            outline: 'none',
            color: '#fff'
          }}
        />
        <MagneticButton
          type="submit"
          style={{
            borderRadius: '40px',
            padding: '1rem 2.5rem',
            margin: '0',
            fontWeight: 600,
            fontSize: '1.05rem',
            background: 'var(--accent-purple)',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Subscribe
        </MagneticButton>
      </form>
    </section>
  );
}
