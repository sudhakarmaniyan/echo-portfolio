import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, MessageSquareHeart, Briefcase, Package, LogOut, X, Edit, Trash2, Users, MessageCircle, Clock, CheckSquare, Mail, UserCog, Lock } from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'Dashboard');

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Generic form state for all entities
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [gallery1File, setGallery1File] = useState<File | null>(null);
  const [gallery2File, setGallery2File] = useState<File | null>(null);
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    subscribers: 0,
    testimonials: 0,
    packages: 0,
    orders: 0,
    recentOrders: [] as any[],
    recentProjects: [] as any[],
    recentActivities: [] as any[]
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

  // --- Auth Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error connecting to server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setLoginEmail('');
    setLoginPassword('');
  };

  // Utility fetch with auth
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      throw new Error('Unauthorized');
    }
    return res;
  };

  const fetchTabResource = (tab: string) => {
    if (!token) return;

    if (tab === 'Dashboard') {
      setLoading(true);
      Promise.all([
        fetchWithAuth(`${API_URL}/messages`).then(res => res.json()),
        fetchWithAuth(`${API_URL}/testimonials`).then(res => res.json()),
        fetchWithAuth(`${API_URL}/packages`).then(res => res.json()),
        fetchWithAuth(`${API_URL}/projects`).then(res => res.json()),
        fetchWithAuth(`${API_URL}/counts`).then(res => res.json()),
        fetchWithAuth(`${API_URL}/activities`).then(res => res.json())
      ])
      .then(([messages, testimonials, packages, projects, counts, activities]) => {
        setDashboardStats({
          subscribers: Array.isArray(counts) && counts.length > 0 ? parseInt(counts[0].value) || 1 : 1,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          packages: Array.isArray(packages) ? packages.length : 0,
          orders: Array.isArray(messages) ? messages.length : 0,
          recentOrders: Array.isArray(messages) ? messages.slice(0, 5) : [],
          recentProjects: Array.isArray(projects) ? projects.slice(0, 3) : [],
          recentActivities: Array.isArray(activities) ? activities : []
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
    else if (tab === 'Order Management') endpoint = '/orders';
    else if (tab === 'Mail System') endpoint = '/messages';
    else if (tab === 'Admin Management') endpoint = '/admins';
    
    if (endpoint) {
      setLoading(true);
      fetchWithAuth(`${API_URL}${endpoint}`)
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
    if (token) {
      fetchTabResource(activeTab);
      setFormData({});
      setEditingId(null);
      setFileToUpload(null);
      setGallery1File(null);
      setGallery2File(null);
      setTestimonialFile(null);
      setStatus('');
    }
  }, [activeTab, token]);

  const handleSubmit = async (e: React.FormEvent, endpoint: string) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      let finalFormData = { ...formData };

      const uploadFile = async (file: File) => {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const res = await fetchWithAuth(`${API_URL}/upload`, { 
          method: 'POST', 
          body: uploadData
        });
        if (res.ok) {
          const { url } = await res.json();
          return url;
        }
        throw new Error('Upload failed');
      };

      if (fileToUpload) {
        setStatus('Uploading main image...');
        try {
          const url = await uploadFile(fileToUpload);
          if (endpoint === '/projects') finalFormData.image_url = url;
          if (endpoint === '/testimonials') finalFormData.avatar_url = url;
          if (endpoint === '/services') finalFormData.bg_image = url;
        } catch (err) {
          setStatus('Image upload failed.');
          return;
        }
      }

      if (endpoint === '/projects') {
        if (gallery1File) {
          try {
            const url = await uploadFile(gallery1File);
            finalFormData.gallery_image_1 = url;
          } catch(e) {}
        }
        if (gallery2File) {
          try {
            const url = await uploadFile(gallery2File);
            finalFormData.gallery_image_2 = url;
          } catch(e) {}
        }
        if (testimonialFile) {
          try {
            const url = await uploadFile(testimonialFile);
            finalFormData.testimonial_thumbnail = url;
          } catch(e) {}
        }
      }

      const url = editingId ? `${API_URL}${endpoint}/${editingId}` : `${API_URL}${endpoint}`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });
      
      if (res.ok) {
        setStatus('Saved successfully!');
        setFormData({});
        setEditingId(null);
        setFileToUpload(null);
        setGallery1File(null);
        setGallery2File(null);
        setTestimonialFile(null);
        fetchTabResource(activeTab);
        setTimeout(() => {
          setIsModalOpen(false);
          setStatus('');
        }, 800);
      } else {
        const resData = await res.json();
        setStatus(resData.error || 'Error saving.');
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
    setGallery1File(null);
    setGallery2File(null);
    setTestimonialFile(null);
    setStatus('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, endpoint: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}${endpoint}/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok) {
        fetchTabResource(activeTab);
      } else {
        alert(resData.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setStatus('');
    setIsModalOpen(true);
  };

  // --- Render Login View ---
  if (!token) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
        <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--accent-purple)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(168, 85, 247, 0.3)' }}>
              <Lock size={30} />
            </div>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 'bold' }}>Admin Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Sign in to manage your portfolio</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                placeholder="admin@example.com"
                style={{ padding: '0.8rem 1rem', transition: 'border-color 0.3s' }}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                required 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '0.8rem 1rem', transition: 'border-color 0.3s' }}
              />
            </div>
            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', padding: '0.75rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {loginError}
              </div>
            )}
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '1rem', marginTop: '1rem', opacity: isLoggingIn ? 0.7 : 1, transition: 'all 0.3s ease' }} 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Dashboard View ---
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

      <div className="panel-card" style={{ marginTop: '1.5rem' }}>
        <h3>Live Activity Log</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>A real-time record of all updates happening across the platform.</p>
        <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {dashboardStats.recentActivities.length === 0 ? (
            <p style={{color: 'var(--text-secondary)'}}>No recent activity.</p>
          ) : (
            dashboardStats.recentActivities.map((act: any) => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: act.action_type === 'CREATE' ? '#dcfce7' : act.action_type === 'DELETE' ? '#fee2e2' : act.action_type === 'UPDATE' ? '#e0e7ff' : '#f3e8ff',
                  color: act.action_type === 'CREATE' ? '#166534' : act.action_type === 'DELETE' ? '#991b1b' : act.action_type === 'UPDATE' ? '#3730a3' : '#6b21a8'
                }}>
                  {act.action_type === 'CREATE' ? <Package size={18}/> : act.action_type === 'DELETE' ? <Trash2 size={18}/> : act.action_type === 'UPDATE' ? <Edit size={18}/> : <Clock size={18}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{act.description}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(act.created_at).toLocaleString()} • {act.entity_type} {act.entity_id ? `(#${act.entity_id})` : ''}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: '#e5e7eb', fontWeight: 600, color: '#4b5563' }}>
                  {act.action_type}
                </div>
              </div>
            ))
          )}
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
        <thead><tr><th>Image</th><th>Title</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>
                {item.bg_image ? (
                  <img 
                    src={item.bg_image.startsWith('http') ? item.bg_image : `http://localhost:5000${item.bg_image.startsWith('/') ? '' : '/'}${item.bg_image}`} 
                    alt={item.title}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                ) : (
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#e5e7eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.7rem', textAlign: 'center' }}>No Image</div>
                )}
              </td>
              <td>{item.title}</td><td>{item.description}</td>
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

  // --- NEW MODULES ---

  const renderOrderManagement = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Order Management</h3>
        <button className="btn-primary" onClick={openAddModal}>Add Manual Order</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Client</th><th>Email</th><th>Package</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>#{item.id}</td>
              <td>{item.client_name}</td>
              <td>{item.client_email}</td>
              <td>{item.package_name}</td>
              <td>
                <span style={{
                  padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                  background: item.status === 'Completed' ? '#dcfce7' : item.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                  color: item.status === 'Completed' ? '#166534' : item.status === 'Pending' ? '#92400e' : '#991b1b'
                }}>
                  {item.status}
                </span>
              </td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={14}/></button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/orders')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMailSystem = () => (
    <div className="card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
      <div className="table-header-actions" style={{ marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={24} color="var(--accent-purple)"/> Mail Inbox</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No messages found.</p>
        ) : (
          data.map(msg => (
            <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-purple-light)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>{msg.email}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(msg.created_at).toLocaleString()}</span>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(msg.id, '/messages')} title="Delete Message"><Trash2 size={16}/></button>
                </div>
              </div>
              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAdminManagement = () => (
    <div className="card">
      <div className="table-header-actions">
        <h3>Admin Management</h3>
        <button className="btn-primary" onClick={openAddModal}>Add New Admin</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Email Address</th><th>Added On</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>#{item.id}</td>
              <td>{item.email}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id, '/admins')}><Trash2 size={14}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <div className="form-group"><label>Subtitle</label><input required value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
          <div className="form-group">
            <label>Service Image</label>
            <div className="image-upload-box">
              {fileToUpload ? (
                <img 
                  src={URL.createObjectURL(fileToUpload)} 
                  alt="New Service Preview" 
                  style={{maxWidth: '100%', maxHeight: '80px', objectFit: 'contain'}} 
                />
              ) : formData.bg_image ? (
                <img 
                  src={formData.bg_image.startsWith('http') ? formData.bg_image : `http://localhost:5000${formData.bg_image.startsWith('/') ? '' : '/'}${formData.bg_image}`} 
                  alt="Current Service" 
                  style={{maxWidth: '100%', maxHeight: '80px', objectFit: 'contain'}} 
                />
              ) : (
                <div className="image-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
              )}
              <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center'}}>
                <button type="button" className="btn-choose-file" onClick={() => document.getElementById('serviceFile')?.click()}>Choose file</button>
                <span className="file-name">{fileToUpload ? fileToUpload.name : 'No file chosen'}</span>
              </div>
              <input id="serviceFile" type="file" accept="image/*" style={{display: 'none'}} onChange={e => setFileToUpload(e.target.files?.[0] || null)} />
            </div>
          </div>
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
            <div className="form-group"><label>Description</label><textarea required style={{minHeight: '80px'}} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
            <div className="form-group"><label>Live URL (Optional)</label><input type="url" placeholder="https://example.com" value={formData.live_url || ''} onChange={e => setFormData({...formData, live_url: e.target.value})} /></div>
            
            <hr style={{margin: '1rem 0', opacity: 0.2}} />
            <h4>Gallery Images</h4>
            <div className="form-group">
              <label>Gallery Image 1</label>
              {formData.gallery_image_1 && !gallery1File && <p style={{fontSize: '0.8rem', margin: '0 0 0.5rem 0'}}>Current: {formData.gallery_image_1}</p>}
              <input type="file" accept="image/*" onChange={e => setGallery1File(e.target.files?.[0] || null)} />
            </div>
            <div className="form-group">
              <label>Gallery Image 2</label>
              {formData.gallery_image_2 && !gallery2File && <p style={{fontSize: '0.8rem', margin: '0 0 0.5rem 0'}}>Current: {formData.gallery_image_2}</p>}
              <input type="file" accept="image/*" onChange={e => setGallery2File(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="project-form-right">
            <div className="form-group">
              <label>Project Main Image</label>
              <div className="image-upload-box">
                {fileToUpload ? (
                  <img src={URL.createObjectURL(fileToUpload)} alt="New Project Preview" style={{maxWidth: '100%', maxHeight: '80px', objectFit: 'contain'}} />
                ) : formData.image_url ? (
                  <img src={formData.image_url} alt="Current Project" style={{maxWidth: '100%', maxHeight: '80px', objectFit: 'contain'}} />
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
              </div>
            </div>

            <hr style={{margin: '1rem 0', opacity: 0.2}} />
            <h4>Testimonial Details</h4>
            <div className="form-group">
              <label>Testimonial Thumbnail</label>
              {formData.testimonial_thumbnail && !testimonialFile && <p style={{fontSize: '0.8rem', margin: '0 0 0.5rem 0'}}>Current: {formData.testimonial_thumbnail}</p>}
              <input type="file" accept="image/*" onChange={e => setTestimonialFile(e.target.files?.[0] || null)} />
            </div>
            <div className="form-group">
              <label>Testimonial Quote</label>
              <textarea style={{minHeight: '80px'}} value={formData.testimonial_quote || ''} onChange={e => setFormData({...formData, testimonial_quote: e.target.value})}></textarea>
            </div>
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
    } else if (activeTab === 'Order Management') {
      endpoint = '/orders';
      title = editingId ? 'Update Order Status' : 'Create Manual Order';
      content = (
        <>
          {!editingId && (
            <>
              <div className="form-group"><label>Client Name</label><input required value={formData.client_name || ''} onChange={e => setFormData({...formData, client_name: e.target.value})} /></div>
              <div className="form-group"><label>Client Email</label><input required type="email" value={formData.client_email || ''} onChange={e => setFormData({...formData, client_email: e.target.value})} /></div>
              <div className="form-group"><label>Package Name</label><input required value={formData.package_name || ''} onChange={e => setFormData({...formData, package_name: e.target.value})} /></div>
            </>
          )}
          {editingId && (
            <div className="form-group">
              <label>Status</label>
              <select value={formData.status || 'Pending'} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </>
      );
    } else if (activeTab === 'Admin Management') {
      endpoint = '/admins';
      title = 'Add New Admin';
      content = (
        <>
          <div className="form-group"><label>Email Address</label><input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div className="form-group"><label>Secure Password</label><input required type="password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
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
            <div className="logo-icon">E</div>
            <span>EchoAdmin</span>
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
            <div className="profile-avatar">EA</div>
            <div className="profile-info">
              <span className="profile-name">Echo Admin</span>
              <span className="profile-email">echoadmin@gmail.com</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1 className="page-title">{activeTab}</h1>
          <div className="topbar-right">
            <span>Welcome back, <strong>Echo Admin</strong></span>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {!loading && activeTab === 'Dashboard' && renderDashboard()}
        {!loading && activeTab === 'Services' && renderServices()}
        {!loading && activeTab === 'Testimonials' && renderTestimonials()}
        {!loading && activeTab === 'Projects' && renderProjects()}
        {!loading && activeTab === 'Packages' && renderPackages()}
        {!loading && activeTab === 'count' && renderCounts()}
        {!loading && activeTab === 'Order Management' && renderOrderManagement()}
        {!loading && activeTab === 'Mail System' && renderMailSystem()}
        {!loading && activeTab === 'Admin Management' && renderAdminManagement()}
        {renderModal()}
      </main>
    </div>
  );
}

export default App;
