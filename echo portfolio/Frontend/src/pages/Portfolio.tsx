import { useState, useEffect } from 'react';
import { LayoutGrid, List, X, ExternalLink } from 'lucide-react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import RotatingText from '../components/RotatingText';
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
  const navigate = useNavigate();

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
  // Removed redundant scroll lock here as it is handled perfectly by ProjectModal3D

  return (
    <div className="page-animate section portfolio-page">
      <div className="portfolio-header-section">
        <h1 className="portfolio-main-title giant-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.3 }}>
          Creating next level<br />
          <RotatingText
            texts={['digital products', 'web experiences', 'brand identities', 'UI/UX designs']}
            mainClassName="text-accent"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
            style={{
              color: 'var(--accent-color, #3b60e4)',
              overflow: 'hidden',
              display: 'inline-flex',
              paddingTop: '0',
              paddingBottom: '0.1em',
              marginTop: '0.4em',
              marginBottom: '-0.1em',
              verticalAlign: 'bottom'
            }}
          />
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
              </div>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="snellenberg-list-row"
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    navigate('/portfolio/' + project.id);
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
                  onClick={(p) => navigate('/portfolio/' + p.id)}
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
            opacity: hoveredProject ? 1 : 0,
            scale: hoveredProject ? 1 : 0.8,
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

    </div>
  );
}
