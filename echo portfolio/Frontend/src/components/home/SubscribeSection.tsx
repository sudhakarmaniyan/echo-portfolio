import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

import './SubscribeSection.css';

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
        className="mx-auto subscribe-form"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="subscribe-input"
        />
        <MagneticButton
          type="submit"
          className="subscribe-btn"
        >
          Subscribe
        </MagneticButton>
      </form>
    </section>
  );
}
