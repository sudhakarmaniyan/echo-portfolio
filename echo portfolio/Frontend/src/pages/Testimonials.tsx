import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CircularGallery from '../components/CircularGallery';

interface Testimonial {
  id: number;
  author_name: string;
  role: string;
  content: string;
  avatar_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error('Failed to fetch testimonials', err))
      .finally(() => setLoading(false));
  }, []);

  const defaultTestimonials = [
    { id: 991, author_name: 'Sarah Jenkins', role: 'CEO at TechNova', content: 'Echo transformed our brand identity. Their attention to detail and design aesthetics are unmatched.', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800' },
    { id: 992, author_name: 'David Chen', role: 'Founder of DesignCo', content: 'Working with Echo was an absolute pleasure. They delivered a high-performance web app that our users love.', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
    { id: 993, author_name: 'Emma Williams', role: 'Marketing Director', content: 'Our conversion rates doubled after Echo redesigned our landing pages. Truly a phenomenal digital agency.', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800' },
  ];

  const displayData = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const generateTestimonialImage = (testimonial: Testimonial) => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1050; // Taller aspect ratio matches the cards better
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Card background
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);
    
    // Add a subtle gradient/border at the top
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#F59E0B');
    gradient.addColorStop(1, '#ff6b6b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 16);

    const paddingX = 100;
    const maxTextWidth = width - (paddingX * 2);

    // Stars
    ctx.fillStyle = '#F59E0B';
    ctx.font = '46px sans-serif';
    ctx.fillText('★★★★★', paddingX, 250);

    // Quote content
    ctx.fillStyle = '#eeeeee';
    ctx.font = 'italic 38px "Inter", sans-serif';
    const words = testimonial.content.split(' ');
    let line = '';
    let y = 350;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        ctx.fillText(line, paddingX, y);
        line = words[i] + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, paddingX, y);

    // Author
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Inter", sans-serif';
    ctx.fillText(testimonial.author_name, paddingX, y + 160);

    // Role
    ctx.fillStyle = '#888888';
    ctx.font = '30px "Inter", sans-serif';
    ctx.fillText(testimonial.role, paddingX, y + 210);

    return canvas.toDataURL();
  };

  const galleryItems = displayData.map(t => ({
    image: generateTestimonialImage(t),
    text: '' // Removed text from below the card to focus on the card itself
  }));

  return (
    <section id="testimonials" className="section" style={{ perspective: '1000px', paddingBottom: '4rem' }}>
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, rotateX: 30, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hero-subtitle">Client Love</span>
        <h2>What They Say.</h2>
        <p className="mx-auto" style={{ maxWidth: '600px' }}>
          Don't just take our word for it. Read what our partners have to say about working with us.
        </p>
      </motion.div>

      <div style={{ height: '600px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading testimonials...</p>
          </div>
        ) : (
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="transparent"
            borderRadius={0.05}
          />
        )}
      </div>
    </section>
  );
}
