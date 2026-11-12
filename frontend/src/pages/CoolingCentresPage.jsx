import React, { useState } from 'react';
import { Building2, Search, MapPin, Users, CheckCircle, AlertTriangle, Compass, Building } from 'lucide-react';

const CITIES = ['All Cities', 'Chennai', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata'];

export default function CoolingCentresPage({ coolingLocations, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredLocations = coolingLocations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities'
      ? true
      : c.name.toLowerCase().includes(selectedCity.toLowerCase()) || c.address.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesAvailable = onlyAvailable ? c.availableSlots > 0 : true;
    return matchesSearch && matchesCity && matchesAvailable;
  });

  const getStatusBadge = (slots, capacity) => {
    if (slots === 0) {
      return (
        <span style={{ 
          background: 'rgba(239, 68, 68, 0.2)', 
          color: '#f87171', 
          border: '1px solid rgba(239, 68, 68, 0.4)',
          padding: '3px 10px', 
          borderRadius: '12px', 
          fontSize: '0.75rem', 
          fontWeight: 700 
        }}>
          FULL OCCUPANCY
        </span>
      );
    }
    if (slots <= capacity * 0.25) {
      return (
        <span style={{ 
          background: 'rgba(245, 158, 11, 0.2)', 
          color: '#fbbf24', 
          border: '1px solid rgba(245, 158, 11, 0.4)',
          padding: '3px 10px', 
          borderRadius: '12px', 
          fontSize: '0.75rem', 
          fontWeight: 700 
        }}>
          HIGH DEMAND
        </span>
      );
    }
    return (
      <span style={{ 
        background: 'rgba(16, 185, 129, 0.2)', 
        color: '#34d399', 
        border: '1px solid rgba(16, 185, 129, 0.4)',
        padding: '3px 10px', 
        borderRadius: '12px', 
        fontSize: '0.75rem', 
        fontWeight: 700 
      }}>
        AVAILABLE
      </span>
    );
  };

  return (
    <div className="page-container">
      {/* Search & Filter Header Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ color: 'var(--accent-cyan)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search cooling shelters by name or street address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '420px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input 
                type="checkbox" 
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              <span>Open slots only</span>
            </label>

            <button 
              className="btn-primary" 
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              onClick={() => setActiveTab('map')}
            >
              <Compass size={15} />
              <span>Locate on Map</span>
            </button>
          </div>
        </div>

        {/* City Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by City:</span>
          {CITIES.map((c) => (
            <button
              key={c}
              className={`btn-secondary ${selectedCity === c ? 'btn-primary' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => setSelectedCity(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cooling Hubs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
        {filteredLocations.map((c) => {
          const occupancyPct = c.capacity > 0 ? Math.round(((c.capacity - c.availableSlots) / c.capacity) * 100) : 0;
          return (
            <div key={c.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cooling-hub)' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{c.name}</h3>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>Municipal Shelter ID #{c.id}</span>
                    </div>
                  </div>
                  {getStatusBadge(c.availableSlots, c.capacity)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <MapPin size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                  <span>{c.address}</span>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Available Relief Capacity:</span>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                      <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>{c.availableSlots}</strong> / {c.capacity} slots
                    </span>
                  </div>

                  <div className="progress-bar-bg" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${occupancyPct}%`,
                        background: c.availableSlots <= c.capacity * 0.25 
                          ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                          : 'linear-gradient(90deg, #06b6d4, #38bdf8)' 
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>Occupancy Rate: {occupancyPct}%</span>
                    <span>{c.capacity - c.availableSlots} beds in use</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {c.latitude ? `Lat: ${c.latitude.toFixed(3)}, Lng: ${c.longitude.toFixed(3)}` : 'Air Conditioned • Water Station'}
                </span>
                <button 
                  className="btn-secondary" 
                  style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                  onClick={() => setActiveTab('map')}
                >
                  View on Map
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>No cooling shelters matching your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
