import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Users, Target, Zap, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import Testimonials from './Testimonials';
import Packages from './Packages';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

import PortfolioList from '../components/PortfolioList';

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const numMatch = value.match(/\d+/);
  const numericValue = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = value.replace(/[0-9]/g, '');

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, numericValue, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

export default function Home() {
  const stats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Awards Won', value: '25' },
    { label: 'Global Clients', value: '40+' },
  ];

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Show only top 3 projects on home page
          setProjects(data.slice(0, 3));
        }
      })
      .catch(err => console.error('Failed to fetch projects', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ perspective: '1000px' }}
    >
      {/* Snellenberg Style Hero Section */}
      <section className="snellenberg-hero">
        {/* Scrolling Marquee Text */}
        <div className="hero-marquee-container">
          <motion.div 
            className="hero-marquee-text"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            Echo Digital Works — Echo Digital Works — Echo Digital Works — Echo Digital Works — 
          </motion.div>
        </div>

        {/* Center CEO Image */}
        <motion.div 
          className="hero-ceo-container"
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src="/ceo_portrait.png" alt="CEO" className="hero-ceo-image" />
        </motion.div>

        {/* Floating Badge (Left) */}
        <motion.div 
          className="hero-floating-badge"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="hero-badge-content">
            <span className="hero-badge-text">Located<br/>in<br/>India</span>
            <div className="hero-badge-icon">
              <Globe size={24} color="#a0a3a7" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Old Hero Section */}
      <section className="hero" style={{ overflow: 'hidden', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Echo Digital Works
          </motion.span>
          <motion.h1
            className="giant-title"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Crafting immersive<br />digital experiences.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            We blend cutting-edge technology with high-end design to build
            brands that stand out in the modern web.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link to="/portfolio" className="btn hover-target">
              View Our Work
            </Link>
            <Link to="/contact" className="btn btn-outline hover-target">
              Start a Project <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" style={{ perspective: '1000px' }}>
        <motion.div
          className="about-grid"
          initial={{ opacity: 0, rotateX: 30, y: 100 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="glass-panel about-image"
            whileHover={{ rotateY: 10, rotateX: -10, scale: 1.02, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d', cursor: 'grab' }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
              alt="Team collaborating"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
            />
          </motion.div>
          <div className="about-content">
            <span className="hero-subtitle">About Us</span>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem', marginTop: '0.5rem', lineHeight: 1.1 }}>Driven by Innovation.</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              We don't just build websites; we craft digital ecosystems. Our team of
              designers and engineers work in unison to push the boundaries of what's
              possible on the web.
            </p>

            <div className="feature-list mt-8">
              <div className="feature-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                  <Zap size={24} color="#a855f7" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Cutting-Edge Tech</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We leverage the latest frameworks for blazing fast performance.</p>
                </div>
              </div>
              <div className="feature-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                  <Target size={24} color="#3b82f6" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Strategic Design</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Every pixel serves a purpose in our conversion-focused designs.</p>
                </div>
              </div>
              <div className="feature-item" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                  <Users size={24} color="#a855f7" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Collaborative Process</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We work with you, not just for you, throughout the entire journey.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Portfolio Section */}
      <section className="section" style={{ perspective: '1000px' }}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, rotateX: 30, y: 50 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-subtitle">Our Portfolio</span>
          <h2 className="giant-title">We provide the Perfect Solution<br />to your business growth</h2>
        </motion.div>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>Check the admin dashboard to add real projects here.</div>
        ) : (
          <PortfolioList projects={projects} />
        )}
      </section>

      {/* Our Achievements Section */}
      <section className="section" style={{ perspective: '1000px' }}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, rotateX: 30, y: 50 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Our Achievements</h2>
          <p className="mx-auto" style={{ maxWidth: '600px' }}>
            Milestones we are proud of achieving over the years.
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card glass-panel text-center"
              initial={{ opacity: 0, rotateY: -30, scale: 0.8 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="stat-value">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Packages Section */}
      <Packages />

      {/* Subscribe Section */}
      <section className="section text-center">
        <span className="hero-subtitle">SUBSCRIBE</span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
          Subscribe To Get The Latest<br />News About Us
        </h2>
        <p className="mx-auto" style={{ maxWidth: '600px', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
          Please Drop Your Email To Get Daily Update About What We Do
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}
          className="mx-auto"
          style={{
            display: 'flex',
            maxWidth: '550px',
            background: 'white',
            borderRadius: '50px',
            padding: '0.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color)'
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
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="submit"
            className="btn"
            style={{
              borderRadius: '40px',
              padding: '1rem 2.5rem',
              margin: '0',
              fontWeight: 600,
              fontSize: '1.05rem'
            }}
          >
            Subscribe
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          By subscribing, you agree to receive our newsletter and accept our <a href="#" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>Privacy Policy</a>.
        </p>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ paddingBottom: '4rem', perspective: '1000px' }}>
        <motion.div
          className="glass-panel text-center"
          initial={{ opacity: 0, rotateX: -30, scale: 0.95 }}
          whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: '5rem 2rem',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
          }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            background: 'linear-gradient(135deg, var(--accent-purple), #a881d2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textShadow: '0 4px 15px rgba(115, 75, 157, 0.1)'
          }}>
            Increase Your Customers' Loyalty and Satisfaction
          </h2>
          <p className="mx-auto" style={{ maxWidth: '700px', fontSize: '1.15rem', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
            We help businesses like yours earn more customers, stand out from competitors, and make more money.
          </p>
          <Link to="/contact" className="btn" style={{
            padding: '1rem 3rem',
            fontSize: '1.1rem',
            borderRadius: '30px',
            boxShadow: 'none',
            transition: 'all 0.3s ease'
          }}>
            Get Started <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
}
