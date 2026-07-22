import { useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
}

interface SnellenbergCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export default function SnellenbergCard({ project, onClick }: SnellenbergCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Springs for the custom cursor "View" badge inside the image
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to the image container center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cursorX.set(x);
    cursorY.set(y);
  };

  return (
    <motion.div 
      className="snellenberg-card hover-target"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(project)}
    >
      <div 
        className="snellenberg-card-image-wrap"
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.img 
          src={project.image_url || 'https://via.placeholder.com/800x600'} 
          alt={project.title}
          animate={{
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Custom cursor badge scoped to image */}
        <motion.div
          className="snellenberg-view-badge"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%"
          }}
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "circOut" }}
        >
          View
        </motion.div>
      </div>

      <div className="snellenberg-card-info">
        <h3 className="snellenberg-card-title">{project.title}</h3>
        <span className="snellenberg-card-role">{project.description}</span>
      </div>
      <div className="snellenberg-card-divider" />
    </motion.div>
  );
}
