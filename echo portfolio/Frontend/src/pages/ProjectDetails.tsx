import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  gallery_image_1?: string;
  gallery_image_2?: string;
  testimonial_thumbnail?: string;
  testimonial_quote?: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(p => p.id === parseInt(id || '0', 10));
          if (found) setProject(found);
        }
      })
      .catch(err => console.error('Failed to fetch project details', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Dynamic Gallery Data with Fallbacks if none provided
  const galleryImages = [
    project?.gallery_image_1,
    project?.gallery_image_2
  ].filter(Boolean) as string[];

  const displayImages = galleryImages.length > 0 ? galleryImages : [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800'
  ];

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Project not found</h2>
        <button className="btn-pill hover-target" onClick={() => navigate('/portfolio')} style={{ marginTop: '2rem' }}>
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="page-animate project-details-page section">
      
      {/* Back Button */}
      <button 
        className="hover-target" 
        onClick={() => navigate('/portfolio')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-color)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '1rem 0',
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={20} /> Back to Projects
      </button>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        minHeight: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '4rem',
        background: '#f8f9fa' // subtle background for the contain image
      }}>
        <img 
          src={project.image_url || 'https://via.placeholder.com/1200x800'} 
          alt={project.title} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '4rem'
        }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1rem', lineHeight: 1 }}>
            {project.title}
          </h1>
          {project.live_url && (
            <div>
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-pill hover-target"
                style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', color: '#111' }}
              >
                <ExternalLink size={20} style={{ marginRight: '8px' }} /> View Live Project
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 6rem auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>About the Project</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-muted, #666)' }}>
          {project.description || 'Creating cutting-edge digital experiences and immersive visual designs. This project represents our commitment to pushing the boundaries of what is possible on the web.'}
        </p>
      </div>

      {/* Gallery Section */}
      <div style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Project Showcase</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {displayImages.map((img, idx) => (
            <motion.div 
              key={idx}
              className="gallery-item hover-target"
              whileHover={{ scale: 1.03, y: -10 }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Testimonial Section */}
      {(project.testimonial_thumbnail || project.testimonial_quote) && (
      <div style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Client Testimonial</h2>
        <div className="hover-target" style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          borderRadius: '15px',
          overflow: 'hidden',
          aspectRatio: '16/9',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={project.testimonial_thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"} 
            alt="Video Thumbnail" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            padding: '2rem'
          }}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom: '1rem',
                border: '2px solid rgba(255,255,255,0.5)'
              }}
            >
              <Play size={40} fill="currentColor" style={{ marginLeft: '5px' }} />
            </motion.div>
            <p style={{ fontSize: '1.5rem', fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textAlign: 'center' }}>
              "{project.testimonial_quote || 'They completely transformed our business...'}"
            </p>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
