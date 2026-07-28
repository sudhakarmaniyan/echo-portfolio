import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import CircularGallery from '../components/CircularGallery';

interface Testimonial {
  id: number;
  author_name: string;
  role: string;
  content: string;
  avatar_url?: string;
  emoji?: string;
}

export default function Testimonials() {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<{ image: string, text: string }[]>([]);


  const generateTestimonialImage = (testimonial: Testimonial): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1050; 
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

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

      const avatarRadius = 45;
      const avatarX = paddingX + avatarRadius;
      const avatarY = y + 160;
      const textStartX = avatarX + avatarRadius + 30;

      // Author
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Inter", sans-serif';
      ctx.fillText(testimonial.author_name, textStartX, avatarY - 5);

      // Role
      ctx.fillStyle = '#888888';
      ctx.font = '30px "Inter", sans-serif';
      ctx.fillText(testimonial.role, textStartX, avatarY + 40);

      // --- Draw Circular Avatar ---
      if (testimonial.avatar_url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();

          // Stroke
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 3;
          ctx.stroke();

          resolve(canvas.toDataURL());
        };
        img.onerror = () => {
          // Fallback
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#222222';
          ctx.fill();
          resolve(canvas.toDataURL());
        };
        img.src = testimonial.avatar_url;
      } else {
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#222222';
        ctx.fill();
        resolve(canvas.toDataURL());
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    const generateAll = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
        const apiTestimonials: Testimonial[] = await res.json();
        
        if (isMounted) {
          // removed setTestimonials
        }

        if (apiTestimonials && apiTestimonials.length > 0) {
          const items = await Promise.all(apiTestimonials.map(async (t) => {
            const imageBase64 = await generateTestimonialImage(t);
            return { image: imageBase64, text: '' };
          }));
          if (isMounted) {
            setGalleryItems(items);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setGalleryItems([]);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    generateAll();

    return () => { isMounted = false; };
  }, []);

  return (
    <section id="testimonials" className="section" style={{ perspective: '1000px', paddingBottom: '6rem', width: '100%' }}>
      <div className="container">
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
      </div>

      <div style={{ height: '600px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading testimonials...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No testimonials available yet.</p>
          </div>
        ) : (
          <CircularGallery
            items={galleryItems}
            bend={0} 
            textColor="transparent"
            borderRadius={0.05}
          />
        )}
      </div>
    </section>
  );
}

