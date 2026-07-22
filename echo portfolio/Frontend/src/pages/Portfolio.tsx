import { useState, useEffect } from 'react';
import { ExternalLink, LayoutGrid, List, X } from 'lucide-react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import SnellenbergCard from '../components/SnellenbergCard';
interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Use springs for smooth cursor following (list view)
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch(err => console.error('Failed to fetch projects', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (viewMode === 'list') {
      const moveCursor = (e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };
      window.addEventListener('mousemove', moveCursor);
      return () => {
        window.removeEventListener('mousemove', moveCursor);
      };
    }
  }, [viewMode, cursorX, cursorY]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <div className="page-animate section portfolio-page">
      <div className="portfolio-header-section">
        <h1 className="portfolio-main-title giant-title">
          Creating next level<br />digital products
        </h1>
        
        <div className="portfolio-controls">
          <div className="view-toggles">
            <button 
              className={`view-toggle-btn hover-target ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={20} />
            </button>
            <button 
              className={`view-toggle-btn hover-target ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>No projects found. Check the admin dashboard.</div>
      ) : (
        <div className={`portfolio-content view-${viewMode}`}>
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="portfolio-list-view">
              <div className="portfolio-list-header">
                <span className="col-client">CLIENT</span>
                <span className="col-services">SERVICES</span>
              </div>
              
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="snellenberg-list-row"
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    setSelectedProject(project);
                    setHoveredProject(null);
                  }}
                >
                  <h3 className="col-client" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  <span className="col-services category">{project.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="snellenberg-grid">
              {projects.map((project) => (
                <SnellenbergCard 
                  key={project.id} 
                  project={project} 
                  onClick={setSelectedProject} 
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* Floating Image Portal (List View) */}
      {viewMode === 'list' && createPortal(
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

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="project-modal-content"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="project-modal-close hover-target"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              
              <img 
                src={selectedProject.image_url || 'https://via.placeholder.com/800x400'} 
                alt={selectedProject.title}
                className="project-modal-image"
              />
              
              <div className="project-modal-body">
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
                
                {selectedProject.live_url && (
                  <a 
                    href={selectedProject.live_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="project-modal-live-btn hover-target"
                  >
                    <ExternalLink size={20} /> View Live Project
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
