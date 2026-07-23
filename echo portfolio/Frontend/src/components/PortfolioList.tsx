import { useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';
import ProjectModal3D from './ProjectModal3D';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

interface PortfolioListProps {
  projects: Project[];
}

export default function PortfolioList({ projects }: PortfolioListProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Use springs for smooth following
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  // Lock scroll when modal is open
  // Removed redundant scroll lock here as it is handled perfectly by ProjectModal3D

  return (
    <div className="portfolio-section-container">
      <div className="portfolio-list" style={{ perspective: '1000px' }}>
        {projects.slice(0, 5).map((project, index) => (
          <motion.div 
            key={project.id} 
            className="snellenberg-list-row"
            initial={{ opacity: 0, rotateX: 30, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => {
              setSelectedProject(project);
              setHoveredProject(null); // hide floating image on click
            }}
          >
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {project.title}
              {project.live_url && (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="title-live-link hover-target" 
                  title="View Live Project"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </h3>
            <span className="category">{project.description || 'Design & Development'}</span>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/portfolio" className="btn-pill hover-target">
          More work <sup style={{ marginLeft: '4px' }}>{projects.length}</sup>
        </Link>
      </div>

      {/* Floating Image Portal */}
      {createPortal(
        <motion.div
          className="floating-project-image"
          style={{
            x: cursorX,
            y: cursorY,
          }}
          animate={{
            opacity: hoveredProject && !selectedProject ? 1 : 0,
            scale: hoveredProject && !selectedProject ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          {hoveredProject && (
            <>
              <img src={hoveredProject.image_url || 'https://via.placeholder.com/400x300'} alt={hoveredProject.title} />
              <div className="view-badge">View</div>
            </>
          )}
        </motion.div>,
        document.body
      )}

      {/* Project Details 3D Modal */}
      <ProjectModal3D 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
