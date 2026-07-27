import AboutSection from '../components/home/AboutSection';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const stats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Awards Won', value: '25' },
    { label: 'Global Clients', value: '40+' },
  ];

  return (
    <div className="page-animate">
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Render the newly updated Bento Grid About Section */}
        <AboutSection />
        
        {/* Keep the stats that were originally on this page */}
        <motion.div 
          className="stats-grid mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass-panel text-center" style={{ padding: '2rem' }}>
              <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>
                {stat.value}
              </div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
