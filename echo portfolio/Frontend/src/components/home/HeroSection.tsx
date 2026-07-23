import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const marqueeScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <motion.section id="hero" className="snellenberg-hero" style={{ opacity: heroOpacity, y: heroY }}>
      {/* Scrolling Marquee Text */}
      <motion.div className="hero-marquee-container" style={{ scale: marqueeScale }}>
        <motion.div
          className="hero-marquee-text"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          Echo Digital Works — Echo Digital Works — Echo Digital Works — Echo Digital Works —
        </motion.div>
      </motion.div>

      {/* Center CEO Image */}
      <motion.div
        className="hero-ceo-container"
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/ceo_portrait.png" alt="CEO" className="hero-ceo-image" />
      </motion.div>
    </motion.section>
  );
}
