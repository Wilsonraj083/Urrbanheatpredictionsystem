import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, Clock, ShieldAlert } from 'lucide-react';

export default function Header({ activeTab, onRefresh, isRefreshing, backendOnline }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Heat Monitoring Dashboard', subtitle: 'Real-time urban microclimate sensor telemetries & shelter availability' };
      case 'prediction':
        return { title: 'Urban Heat Risk Estimator', subtitle: 'Explainable Steadman-based thermal stress assessment & mitigation planner' };
      case 'map':
        return { title: 'Geospatial Heat Island Map', subtitle: 'Interactive GIS visualization of thermal hotspots & cooling facilities' };
      case 'cooling':
        return { title: 'Municipal Cooling Shelters Directory', subtitle: 'Monitor real-time occupant capacity, relief slots, and shelter status' };
      case 'admin':
        return { title: 'Administrative Control Center', subtitle: 'Ingest thermal readings, update cooling hubs, and manage records' };
      default:
        return { title: 'Urban Heat Platform', subtitle: 'Smart city thermal resilience system' };
    }
  };

  const info = getPageInfo();

  return (
    <header className="top-header">
      <div className="header-title">
        <h1>{info.title}</h1>
        <p>{info.subtitle}</p>
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <Clock size={15} style={{ color: 'var(--accent-cyan)' }} />
          <span>{currentTime}</span>
        </div>

        <div className="status-badge" style={{ 
          background: backendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
          borderColor: backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)',
          color: backendOnline ? '#34d399' : '#38bdf8'
        }}>
          <Radio size={14} />
          <span>{backendOnline ? 'Spring Boot REST API Live' : 'Cloud Edition (Active)'}</span>
        </div>

        <button 
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          title="Reload fresh data from Spring Boot API"
        >
          <RefreshCw size={15} />
          <span>Sync Data</span>
        </button>
      </div>
    </header>
  );
}
