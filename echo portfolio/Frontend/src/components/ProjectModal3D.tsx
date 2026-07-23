import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

interface ProjectModal3DProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal3D({ project, onClose }: ProjectModal3DProps) {
  // Lock scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // @ts-ignore
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // @ts-ignore
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // @ts-ignore
      if (window.lenis) window.lenis.start();
    };
  }, [project]);

  // 3D tracking setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalize coordinates from -1 to 1 based on the modal's dimensions
    const xPct = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const yPct = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Stronger 3D transforms for a massive 3D popup
  const rotateX = useTransform(y, [-1, 1], [6, -6]);
  const rotateY = useTransform(x, [-1, 1], [-6, 6]);

  // Fake Gallery Data
  const galleryImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  ];
  const modalContent = (
    <AnimatePresence>
      {project && (
        <motion.div 
          className="modal-3d-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
        >
          <div 
            className="modal-3d-perspective-wrapper" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
          >
            <motion.div 
              className="modal-3d-content"
              initial={{ opacity: 0, scale: 0.9, y: 100, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50, rotateX: -10 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ rotateX, rotateY }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-3d-scroll-area" data-lenis-prevent>
              
              {/* Close Button */}
              <button className="modal-3d-close hover-target" onClick={onClose}>
                <X size={28} />
              </button>

              {/* Header Section */}
              <div className="modal-3d-header">
                <div className="modal-3d-main-img-container">
                  <img src={project.image_url || 'https://via.placeholder.com/800x400'} alt={project.title} />
                  <div className="modal-3d-img-overlay"></div>
                </div>
                
                <div className="modal-3d-title-area">
                  <h2>{project.title}</h2>
                  <p>{project.description || 'Creating cutting-edge digital experiences and immersive visual designs.'}</p>
                  
                  {project.live_url && (
                    <a 
                      href={project.live_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-pill hover-target"
                      style={{ marginTop: '1.5rem', display: 'inline-flex' }}
                    >
                      <ExternalLink size={20} style={{ marginRight: '8px' }} /> View Live Project
                    </a>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="modal-3d-section">
                <h3>Project Showcase</h3>
                <div className="modal-3d-gallery">
                  {galleryImages.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      className="gallery-item hover-target"
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Video Testimonial Section */}
              <div className="modal-3d-section">
                <h3>Client Testimonial</h3>
                <div className="modal-3d-video-container hover-target">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" alt="Video Thumbnail" />
                  <div className="video-overlay">
                    <motion.div 
                      className="play-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play size={40} fill="currentColor" />
                    </motion.div>
                    <p className="video-title">"They completely transformed our business..."</p>
                  </div>
                </div>
              </div>

              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use createPortal to mount the modal directly to document.body
  // This prevents position: fixed from being broken by parent CSS transforms.
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
