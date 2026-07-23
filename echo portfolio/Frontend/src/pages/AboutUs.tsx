import { Users, Target, Zap } from 'lucide-react';

export default function AboutUs() {
  const stats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Awards Won', value: '25' },
    { label: 'Global Clients', value: '40+' },
  ];

  return (
    <div className="page-animate section">
      <div className="text-center mb-12">
        <span className="hero-subtitle">Our Story</span>
        <h2>Redefining Digital Landscapes.</h2>
        <p className="mx-auto" style={{ maxWidth: '700px' }}>
          Echo is a premium digital agency focused on delivering high-performance,
          aesthetically stunning digital products for brands that refuse to blend in.
        </p>
      </div>

      <div className="about-grid">
        <div className="glass-panel about-image">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team collaborating" />
        </div>
        <div className="about-content">
          <h3>Driven by Innovation.</h3>
          <p>
            We don't just build websites; we craft digital ecosystems. Our team of
            designers and engineers work in unison to push the boundaries of what's
            possible on the web.
          </p>

          <div className="feature-list mt-8">
            <div className="feature-item">
              <Zap className="feature-icon text-accent-purple" />
              <div>
                <h4>Cutting-Edge Tech</h4>
                <p>We leverage the latest frameworks for blazing fast performance.</p>
              </div>
            </div>
            <div className="feature-item mt-4">
              <Target className="feature-icon text-accent-blue" />
              <div>
                <h4>Strategic Design</h4>
                <p>Every pixel serves a purpose in our conversion-focused designs.</p>
              </div>
            </div>
            <div className="feature-item mt-4">
              <Users className="feature-icon text-accent-purple" />
              <div>
                <h4>Collaborative Process</h4>
                <p>We work with you, not just for you, throughout the entire journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid mt-16">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-panel text-center">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
