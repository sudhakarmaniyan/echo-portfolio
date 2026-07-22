import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, MessageSquareHeart, Briefcase, Package, LogOut, X, Edit, Trash2, Users, MessageCircle, Clock, CheckSquare, Mail, UserCog } from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Generic form state for all entities
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    subscribers: 0,
    testimonials: 0,
    packages: 0,
    orders: 0,
    recentOrders: [] as any[],
    recentProjects: [] as any[]
  });

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Services', icon: Settings },
    { name: 'count', icon: Users },
    { name: 'Projects', icon: Briefcase },
    { name: 'Packages', icon: Package },
    { name: 'Order Management', icon: CheckSquare },
    { name: 'Testimonials', icon: MessageSquareHeart },
    { name: 'Mail System', icon: Mail },
    { name: 'Admin Management', icon: UserCog }
  ];

  const fetchTabResource = (tab: string) => {
    if (tab === 'Dashboard') {
      setLoading(true);
      Promise.all([
        fetch(`${API_URL}/messages`).then(res => res.json()),
        fetch(`${API_URL}/testimonials`).then(res => res.json()),
        fetch(`${API_URL}/packages`).then(res => res.json()),
        fetch(`${API_URL}/projects`).then(res => res.json()),
        fetch(`${API_URL}/counts`).then(res => res.json())
      ])
      .then(([messages, testimonials, packages, projects, counts]) => {
        setDashboardStats({
          subscribers: Array.isArray(counts) && counts.length > 0 ? parseInt(counts[0].value) || 1 : 1,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          packages: Array.isArray(packages) ? packages.length : 0,
          orders: Array.isArray(messages) ? messages.length : 0,
          recentOrders: Array.isArray(messages) ? messages.slice(0, 5) : [],
          recentProjects: Array.isArray(projects) ? projects.slice(0, 3) : []
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
      return;
    }

    let endpoint = '';
    if (tab === 'Services') endpoint = '/services';
    else if (tab === 'Testimonials') endpoint = '/testimonials';
    else if (tab === 'Projects') endpoint = '/projects';
    else if (tab === 'Packages') endpoint = '/packages';
    else if (tab === 'count') endpoint = '/counts';
    
    if (endpoint) {
      setLoading(true);
      fetch(`${API_URL}${endpoint}`)
        .then(res => res.json())
        .then(resData => {
          if (Array.isArray(resData)) setData(resData);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchTabResource(activeTab);
    setFormData({});
    setEditingId(null);
    setFileToUpload(null);
    setStatus('');
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent, endpoint: string) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      let finalFormData = { ...formData };

      // Handle file upload if a file is selected
      if (fileToUpload) {
        setStatus('Uploading image...');
        const uploadData = new FormData();
        uploadData.append('image', fileToUpload);
        
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          if (endpoint === '/projects') finalFormData.image_url = url;
          if (endpoint === '/testimonials') finalFormData.avatar_url = url;
        } else {
          setStatus('Image upload failed.');
          return;
        }
      }

      const url = editingId ? `${API_URL}${endpoint}/${editingId}` : `${API_URL}${endpoint}`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });
      
      if (res.ok) {
        setStatus('Saved successfully!');
        setFormData({});
        setEditingId(null);
        setFileToUpload(null);
        fetchTabResource(activeTab);
        setTimeout(() => {
          setIsModalOpen(false);
          setStatus('');
        }, 800);
      } else {
        setStatus('Error saving.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error saving.');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({});
    setFileToUpload(null);
    setStatus('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, endpoint: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetch(`${API_URL}${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTabResource(activeTab);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setStatus('');
    setIsModalOpen(true);
  };

  const renderDashboard = () => (
    <div className="dashboard-content-wrapper">
      <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Welcome to your admin dashboard</p>
      
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <div className="summary-info">
            <span className="summary-label">Total Subscribers</span>
            <span className="summary-value">{dashboardStats.subscribers}</span>
          </div>
          <div className="summary-icon-box blue">
            <Users size={20} />
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-info">
            <span className="summary-label">Testimonials</span>
            <span className="summary-value">{dashboardStats.testimonials}</span>
          </div>
          <div className="summary-icon-box green">
            <MessageCircle size={20} />
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-info">
            <span className="summary-label">Active Packages</span>
            <span className="summary-value">{dashboardStats.packages}</span>
          </div>
          <div className="summary-icon-box purple">
            <Package size={20} />
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-info">
            <span className="summary-label">Pending Orders</span>
            <span className="summary-value">{dashboardStats.orders}</span>
          </div>
          <div className="summary-icon-box orange">
            <Clock size={20} />
          </div>
        </div>
      </div>

      <div className="dashboard-panels-grid">
        <div className="panel-card">
          <h3>Recent Orders</h3>
          <div className="recent-orders-list">
            {dashboardStats.recentOrders.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>No recent orders.</p>
            ) : (
              dashboardStats.recentOrders.map(order => (
                <div className="recent-order-item" key={order.id}>
                  <div className="order-dot orange"></div>
                  <div className="order-info">
                    <strong>New Order: {order.message?.substring(0,30) || 'Service Inquiry'}...</strong>
                    <span>by {order.name} • {new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-card">
          <h3>Recent Projects</h3>
          <div className="recent-projects-list">
            {dashboardStats.recentProjects.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>No recent projects.</p>
            ) : (
              dashboardStats.recentProjects.map(proj => (
                <div className="recent-project-item" key={proj.id}>
                  <div className="project-icon-box purple-light">
                    <Briefcase size={16} />
                  </div>
                  <div className="project-info">
                    <strong>{proj.title}</strong>
                    <span>Added {new Date(proj.created_at).toLocaleDateString()}</span>
                  </div>
                  <a href={proj.live_url || '#'} className="view-live-btn" target="_blank" rel="noreferrer">View Live</a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Services</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Service</button>
      </div>
      <table>
        <thead><tr><th>Title</th><th>Description</th><th>Icon</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td><td>{item.description}</td><td>{item.icon}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/services')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTestimonials = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Testimonials</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Testimonial</button>
      </div>
      <table>
        <thead><tr><th>Author</th><th>Role</th><th>Content</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.author_name}</td><td>{item.role}</td><td>{item.content?.substring(0, 50)}...</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/testimonials')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProjects = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Projects</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Project</button>
      </div>
      <table>
        <thead><tr><th>Title</th><th>Link</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.live_url && <a href={item.live_url} target="_blank" rel="noreferrer">View</a>}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/projects')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPackages = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Packages</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Package</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Monthly</th><th>Yearly</th><th>Popular</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td><td>{item.price_monthly}</td><td>{item.price_yearly}</td><td>{item.is_popular ? 'Yes' : 'No'}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/packages')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCounts = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Counts</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Count</button>
      </div>
      <table>
        <thead><tr><th>Label</th><th>Value</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.label}</td><td>{item.value}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/counts')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPlaceholder = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>{activeTab}</h3>
        <button className="btn-primary" onClick={() => alert('Feature coming soon!')}>Add New</button>
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>This module is currently empty or under construction. Check back soon!</p>
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen) return null;

    let endpoint = '';
    let title = '';
    let content = null;

    if (activeTab === 'Services') {
      endpoint = '/services';
      title = editingId ? 'Edit Service' : 'Create New Service';
      content = (
        <>
          <div className="form-group"><label>Title</label><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
          <div className="form-group"><label>Icon (Lucide name)</label><input value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
        </>
      );
    } else if (activeTab === 'Testimonials') {
      endpoint = '/testimonials';
      title = editingId ? 'Edit Testimonial' : 'Create New Testimonial';
      content = (
        <>
          <div className="form-group"><label>Author Name</label><input required value={formData.author_name || ''} onChange={e => setFormData({...formData, author_name: e.target.value})} /></div>
          <div className="form-group"><label>Role / Company</label><input required value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} /></div>
          <div className="form-group"><label>Content</label><textarea required value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})}></textarea></div>
          <div className="form-group">
            <label>Avatar Image (Upload)</label>
            {formData.avatar_url && !fileToUpload && <p style={{fontSize: '0.8rem', margin: '0 0 0.5rem 0'}}>Current: {formData.avatar_url}</p>}
            <input type="file" accept="image/*" onChange={e => setFileToUpload(e.target.files?.[0] || null)} />
          </div>
        </>
      );
    } else if (activeTab === 'Projects') {
      endpoint = '/projects';
      title = editingId ? 'Edit Project' : 'Create New Project';
      content = (
        <div className="project-form-grid">
          <div className="project-form-left">
            <div className="form-group"><label>Title</label><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="form-group"><label>Description</label><textarea required style={{minHeight: '130px'}} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
            <div className="form-group"><label>Live URL (Optional)</label><input type="url" placeholder="https://example.com" value={formData.live_url || ''} onChange={e => setFormData({...formData, live_url: e.target.value})} /></div>
          </div>
          <div className="project-form-right">
            <div className="form-group">
              <label>Project Image</label>
              <div className="image-upload-box">
                {formData.image_url && !fileToUpload ? (
                  <img src={formData.image_url} alt="Current Project" style={{maxWidth: '100%', maxHeight: '120px', objectFit: 'contain'}} />
                ) : (
                  <div className="image-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                )}
                <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <button type="button" className="btn-choose-file" onClick={() => document.getElementById('projectFile')?.click()}>Choose file</button>
                  <span className="file-name">{fileToUpload ? fileToUpload.name : 'No file chosen'}</span>
                </div>
                <input id="projectFile" type="file" accept="image/*" style={{display: 'none'}} onChange={e => setFileToUpload(e.target.files?.[0] || null)} />
                <p className="help-text">Image is required for new project.</p>
              </div>
            </div>
            <div className="form-group" style={{marginTop: '1rem'}}><label>Image Alt Text (Optional)</label><input placeholder="e.g., A screenshot of the new website" /></div>
          </div>
        </div>
      );
    } else if (activeTab === 'Packages') {
      endpoint = '/packages';
      title = editingId ? 'Edit Package' : 'Create New Package';
      content = (
        <>
          <div className="form-group"><label>Name</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="form-group"><label>Monthly Price</label><input required value={formData.price_monthly || ''} onChange={e => setFormData({...formData, price_monthly: e.target.value})} /></div>
          <div className="form-group"><label>Yearly Price</label><input required value={formData.price_yearly || ''} onChange={e => setFormData({...formData, price_yearly: e.target.value})} /></div>
          <div className="form-group"><label>Features (comma separated)</label><textarea required value={formData.features || ''} onChange={e => setFormData({...formData, features: e.target.value})}></textarea></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" style={{width: 'auto'}} checked={formData.is_popular || false} onChange={e => setFormData({...formData, is_popular: e.target.checked})} />
            <label style={{margin: 0}}>Is Popular?</label>
          </div>
        </>
      );
    } else if (activeTab === 'count') {
      endpoint = '/counts';
      title = editingId ? 'Edit Count' : 'Create New Count';
      content = (
        <>
          <div className="form-group"><label>Label</label><input required value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} /></div>
          <div className="form-group"><label>Value</label><input required value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})} /></div>
          <div className="form-group"><label>Icon (Lucide)</label><input required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
        </>
      );
    }

    if (!endpoint) return null;

    return (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, endpoint)}>
            <div className="modal-body">
              {content}
              {status && <p className="modal-status">{status}</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingId ? 'Update' : (title.startsWith('Create') ? title : 'Create')}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-title">
            <div className="logo-icon">A</div>
            <span>AdminPanel</span>
          </div>
          <X size={20} color="var(--text-primary)" cursor="pointer" />
        </div>
        
        <nav className="nav-menu">
          {tabs.map((tab) => (
            <button 
              key={tab.name}
              className={`nav-item ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon strokeWidth={1.5} />
              {tab.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-section">
            <div className="profile-avatar">M</div>
            <div className="profile-info">
              <span className="profile-name">Main Admin</span>
              <span className="profile-email">admin@example.com</span>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={20} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1 className="page-title">{activeTab}</h1>
          <div className="topbar-right">
            <span>Welcome back, <strong>Main Admin</strong></span>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {!loading && activeTab === 'Dashboard' && renderDashboard()}
        {!loading && activeTab === 'Services' && renderServices()}
        {!loading && activeTab === 'Testimonials' && renderTestimonials()}
        {!loading && activeTab === 'Projects' && renderProjects()}
        {!loading && activeTab === 'Packages' && renderPackages()}
        {!loading && activeTab === 'count' && renderCounts()}
        {!loading && ['Order Management', 'Mail System', 'Admin Management'].includes(activeTab) && renderPlaceholder()}
        {renderModal()}
      </main>
    </div>
  );
}

export default App;
