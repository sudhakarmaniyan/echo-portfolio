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
          style={{ display: "flex", width: "max-content" }}
        >
          <span style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
          </span>
          <span style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>Echo Digital Works</span>
            <span style={{ opacity: 0.5 }}>—</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="hero-background-video"
        src="/hero_video.mp4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </motion.section>
  );
}
