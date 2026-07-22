import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="page-animate section">
      <div className="text-center mb-12">
        <span className="hero-subtitle">Get In Touch</span>
        <h2>Let's build something.</h2>
        <p className="mx-auto" style={{ maxWidth: '600px' }}>
          Ready to take your digital presence to the next level? 
          Drop us a line and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info glass-panel">
          <h3>Contact Information</h3>
          <p>Fill up the form and our team will get back to you within 24 hours.</p>
          
          <div className="info-items">
            <div className="info-item">
              <Phone className="info-icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="info-item">
              <Mail className="info-icon" />
              <span>hello@echodigital.agency</span>
            </div>
            <div className="info-item">
              <MapPin className="info-icon" />
              <span>123 Innovation Drive<br />Tech District, CA 94103</span>
            </div>
          </div>
        </div>

        <div className="glass-panel contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                required 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us about your project..."
              ></textarea>
            </div>
            <button type="submit" className="btn submit-btn">
              <span>Send Message</span> <Send size={18} />
            </button>
            {status && (
              <p className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
