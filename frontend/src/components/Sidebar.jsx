import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Map as MapIcon, 
  Building2, 
  Settings, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'prediction', label: 'Heat Risk Prediction', icon: Flame },
    { id: 'map', label: 'Interactive Heat Map', icon: MapIcon },
    { id: 'cooling', label: 'Cooling Shelters Hub', icon: Building2 },
    { id: 'admin', label: 'Admin Management', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">
          <Flame size={24} />
        </div>
        <div className="logo-text">
          <h2>URBANHEAT</h2>
          <span>Smart City Resiliency</span>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
              <button onClick={() => setActiveTab(item.id)}>
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span className="pulse-dot"></span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>IoT Grid Connected</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
          Spring Boot 4.1.1 &bull; H2 DB<br />
          College Demo Edition 2026
        </p>
      </div>
    </aside>
  );
}
