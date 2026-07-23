import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Package {
  id: number;
  name: string;
  price_monthly: string;
  price_yearly: string;
  features: string;
  is_popular: boolean;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPackages(data);
        }
      })
      .catch(err => console.error('Failed to fetch packages', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="packages" className="section" style={{ background: 'var(--bg-alt)', margin: '0 calc(-50vw + 50%)', padding: '6rem 0', width: '100vw' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="text-center mb-12">
          <h2>Choose Your Plan</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <span style={{ fontWeight: isYearly ? 'normal' : 'bold', color: isYearly ? 'var(--text-secondary)' : 'var(--text-primary)' }}>Monthly</span>
            
            <button 
              onClick={() => setIsYearly(!isYearly)}
              style={{
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                background: '#e0e0e0',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: isYearly ? '32px' : '2px',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>

            <span style={{ fontWeight: isYearly ? 'bold' : 'normal', color: isYearly ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Yearly</span>
          </div>
        </div>

        <div className="grid pricing-grid" style={{ perspective: '1200px' }}>
          {loading ? (
            <p className="text-center w-full col-span-full">Loading packages...</p>
          ) : (
            (packages.length > 0 ? packages : [
              { id: 991, name: 'Starter Plan', price_monthly: '$49/mo', price_yearly: '$490/yr', features: '1 Website\nBasic Support\nShared Server\nFree SSL', is_popular: false },
              { id: 992, name: 'Pro Plan', price_monthly: '$99/mo', price_yearly: '$990/yr', features: '5 Websites\nPriority Support\nVPS Hosting\nFree SSL\nDaily Backups', is_popular: true },
              { id: 993, name: 'Enterprise', price_monthly: '$249/mo', price_yearly: '$2490/yr', features: 'Unlimited Websites\n24/7 Dedicated Support\nDedicated Server\nFree SSL\nHourly Backups\nCustom Integrations', is_popular: false },
            ]).map((pkg, i) => (
              <motion.div 
                key={pkg.id} 
                className={`pricing-card glass-panel ${pkg.is_popular ? 'recommended' : ''}`} 
                style={{ background: 'white' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10, 
                  rotateX: -5,
                  z: 50,
                  boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {pkg.is_popular && <div className="recommended-badge">Most Popular</div>}
                <h3>{pkg.name}</h3>
                <div className="price">{isYearly ? pkg.price_yearly : pkg.price_monthly}</div>
                
                <ul className="features-list">
                  {pkg.features && pkg.features.split('\n').filter(f => f.trim() !== '').map((feature, idx) => (
                    <li key={idx}>
                      <Check size={18} className="text-accent-blue" />
                      <span>{feature.trim()}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/contact" className={`btn ${pkg.is_popular ? '' : 'btn-outline'} w-full text-center mt-auto`}>
                  Get Started
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
