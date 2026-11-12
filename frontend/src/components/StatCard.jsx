import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color, glowColor }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div 
        className="stat-icon" 
        style={{ 
          background: glowColor || `${color}20`, 
          color: color 
        }}
      >
        <Icon size={26} />
      </div>
      <div className="stat-info">
        <p>{title}</p>
        <h3>{value}</h3>
        {subtext && <div className="stat-sub" style={{ color: color }}>{subtext}</div>}
      </div>
    </div>
  );
}
