import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Filter, Flame, Building2, Layers, Navigation } from 'lucide-react';

const CITIES = [
  { name: 'All India (Nationwide Overview)', center: [21.5, 78.9], zoom: 5 },
  { name: 'Chennai', center: [13.045, 80.24], zoom: 12 },
  { name: 'Delhi NCR', center: [28.625, 77.22], zoom: 12 },
  { name: 'Mumbai', center: [19.065, 72.86], zoom: 12 },
  { name: 'Bengaluru', center: [12.96, 77.65], zoom: 12 },
  { name: 'Hyderabad', center: [17.42, 78.42], zoom: 12 },
  { name: 'Kolkata', center: [22.58, 88.38], zoom: 12 },
  { name: 'Ahmedabad', center: [23.03, 72.58], zoom: 12 },
];

export default function HeatMapPage({ heatReports, coolingLocations }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'COOLING'
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  // Helper to create colored glowing pin HTML
  const createPinIcon = (color, label, isShelter = false) => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #ffffff;
          box-shadow: 0 0 16px ${color};
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
          cursor: pointer;
        ">
          ${isShelter ? '🏢' : '🔥'}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CITIES[0].center,
        zoom: CITIES[0].zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Update markers whenever data or activeFilter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Add Heat Reports
    if (activeFilter === 'ALL' || activeFilter === 'HIGH') {
      heatReports.forEach((report) => {
        if (activeFilter === 'HIGH' && report.severity !== 'HIGH') {
          return;
        }

        const lat = report.latitude || 13.04;
        const lng = report.longitude || 80.24;

        let pinColor = '#10b981'; // LOW
        if (report.severity === 'HIGH') pinColor = '#ef4444';
        else if (report.severity === 'MEDIUM') pinColor = '#f59e0b';

        const marker = L.marker([lat, lng], {
          icon: createPinIcon(pinColor, report.severity, false),
        });

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 190px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px; color: #fff;">${report.location}</span>
              <span style="font-size: 10px; font-weight: 700; color: ${pinColor}; border: 1px solid ${pinColor}; padding: 2px 6px; border-radius: 8px;">
                ${report.severity}
              </span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: ${pinColor}; margin-bottom: 4px;">
              🌡️ ${report.temperature}°C
            </div>
            <div style="font-size: 11px; color: #94a3b8;">
              💧 Humidity: ${report.humidity != null ? report.humidity + '%' : 'N/A'}<br/>
              📍 Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 2. Add Cooling Centres
    if (activeFilter === 'ALL' || activeFilter === 'COOLING') {
      coolingLocations.forEach((c) => {
        const lat = c.latitude || 13.045;
        const lng = c.longitude || 80.245;

        const marker = L.marker([lat, lng], {
          icon: createPinIcon('#06b6d4', 'COOLING', true),
        });

        const occupancyPct = c.capacity > 0 ? Math.round(((c.capacity - c.availableSlots) / c.capacity) * 100) : 0;

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 700; font-size: 13px; color: #38bdf8;">${c.name}</span>
              <span style="font-size: 10px; font-weight: 700; color: #34d399; background: rgba(16,185,129,0.2); padding: 2px 6px; border-radius: 8px;">
                SHELTER
              </span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">${c.address}</div>
            <div style="font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 4px;">
              Slots Open: <span style="color: #34d399;">${c.availableSlots}</span> / ${c.capacity}
            </div>
            <div style="font-size: 10px; color: #94a3b8;">
              Occupancy: ${occupancyPct}%
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }
  }, [heatReports, coolingLocations, activeFilter]);

  const handleCityJump = (e) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedCityIndex(idx);
    const city = CITIES[idx];
    if (city && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(city.center, city.zoom, { duration: 1.5 });
    }
  };

  return (
    <div className="page-container">
      {/* Map Control Bar */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* City Jump Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Focus City:</span>
            <select 
              className="form-select"
              value={selectedCityIndex}
              onChange={handleCityJump}
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {CITIES.map((c, i) => (
                <option key={i} value={i} style={{ background: '#0f1c3a', color: '#fff' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layer Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className={`btn-secondary ${activeFilter === 'ALL' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => setActiveFilter('ALL')}
            >
              All Entities ({heatReports.length + coolingLocations.length})
            </button>
            <button 
              className={`btn-secondary ${activeFilter === 'HIGH' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => setActiveFilter('HIGH')}
            >
              <Flame size={14} style={{ color: '#ef4444' }} />
              High Risk Hotspots
            </button>
            <button 
              className={`btn-secondary ${activeFilter === 'COOLING' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => setActiveFilter('COOLING')}
            >
              <Building2 size={14} style={{ color: '#06b6d4' }} />
              Cooling Hubs
            </button>
          </div>

          {/* Pin Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span>High (&gt;=40°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              <span>Medium (30-39°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>Low (&lt;30°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }}></span>
              <span>Cooling Shelters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map View Container */}
      <div className="map-container" ref={mapContainerRef}></div>
    </div>
  );
}
