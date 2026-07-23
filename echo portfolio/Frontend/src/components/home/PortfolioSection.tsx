import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortfolioList from '../PortfolioList';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

export default function PortfolioSection() {
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
    <section id="portfolio" className="section" style={{ perspective: '1000px' }}>
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
  );
}
