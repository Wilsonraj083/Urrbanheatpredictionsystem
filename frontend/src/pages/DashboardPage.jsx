import React, { useState } from 'react';
import { 
  Flame, 
  Thermometer, 
  ShieldAlert, 
  Building2, 
  Droplets, 
  TrendingUp, 
  ArrowUpRight,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import StatCard from '../components/StatCard';

const METRO_CITIES = ['All Cities', 'Chennai', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

export default function DashboardPage({ stats, heatReports, coolingLocations, setActiveTab }) {
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Filter reports by selected city
  const filteredReports = selectedCity === 'All Cities'
    ? heatReports
    : heatReports.filter(r => r.location.toLowerCase().includes(selectedCity.toLowerCase()));

  // Filter cooling locations by selected city
  const filteredCooling = selectedCity === 'All Cities'
    ? coolingLocations
    : coolingLocations.filter(c => 
        c.name.toLowerCase().includes(selectedCity.toLowerCase()) || 
        c.address.toLowerCase().includes(selectedCity.toLowerCase())
      );

  // Compute live filtered metrics
  const totalReportsCount = filteredReports.length;
  const highRiskCount = filteredReports.filter(r => r.severity?.toUpperCase() === 'HIGH').length;
  const mediumRiskCount = filteredReports.filter(r => r.severity?.toUpperCase() === 'MEDIUM').length;
  const lowRiskCount = filteredReports.filter(r => r.severity?.toUpperCase() === 'LOW').length;

  const totalCoolingCentres = filteredCooling.length;
  const totalCapacity = filteredCooling.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const totalAvailableSlots = filteredCooling.reduce((sum, c) => sum + (c.availableSlots || 0), 0);

  const avgTemp = totalReportsCount > 0
    ? (filteredReports.reduce((sum, r) => sum + r.temperature, 0) / totalReportsCount).toFixed(1)
    : '0.0';

  // Severity Distribution data for Pie Chart
  const pieData = [
    { name: 'High Risk (>=40°C)', value: highRiskCount, color: '#ef4444' },
    { name: 'Medium Risk (30-39°C)', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'Low Risk (<30°C)', value: lowRiskCount, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Temperature chart data from heat reports
  const chartData = filteredReports.slice(0, 8).map(r => ({
    name: r.location.length > 15 ? r.location.substring(0, 15) + '...' : r.location,
    temperature: r.temperature,
    severity: r.severity,
  }));

  const getSeverityPill = (severity) => {
    const s = severity?.toLowerCase() || 'low';
    return <span className={`severity-pill ${s}`}>{severity}</span>;
  };

  return (
    <div className="page-container">
      {/* City Filter Pills */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '14px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={17} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>City Monitor:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {METRO_CITIES.map((city) => (
              <button
                key={city}
                className={`btn-secondary ${selectedCity === city ? 'btn-primary' : ''}`}
                style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Statistic Metric Cards */}
      <div className="stats-grid">
        <StatCard 
          title={`Total Reports (${selectedCity})`} 
          value={totalReportsCount} 
          subtext={`Avg Temp: ${avgTemp}°C`}
          icon={Thermometer}
          color="#38bdf8"
          glowColor="rgba(56, 189, 248, 0.18)"
        />
        <StatCard 
          title="High Heat Hotspots" 
          value={highRiskCount} 
          subtext="Critical Thermal Warning (>=40°C)"
          icon={Flame}
          color="#ef4444"
          glowColor="rgba(239, 68, 68, 0.2)"
        />
        <StatCard 
          title="Medium / Low Zones" 
          value={mediumRiskCount + lowRiskCount} 
          subtext={`${mediumRiskCount} Medium • ${lowRiskCount} Low`}
          icon={TrendingUp}
          color="#f59e0b"
          glowColor="rgba(245, 158, 11, 0.18)"
        />
        <StatCard 
          title="Cooling Relief Slots" 
          value={`${totalAvailableSlots} / ${totalCapacity}`} 
          subtext={`Across ${totalCoolingCentres} Shelters in ${selectedCity}`}
          icon={Building2}
          color="#06b6d4"
          glowColor="rgba(6, 182, 212, 0.18)"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Temperature Trend Area Chart */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Thermometer size={20} style={{ color: 'var(--accent-cyan)' }} />
              Hotspot Temperature Spectrum (°C) — {selectedCity}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest Municipal Ingests</span>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    angle={-20} 
                    textAnchor="end" 
                  />
                  <YAxis stroke="#94a3b8" domain={[20, 50]} unit="°C" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f1c3a', 
                      borderColor: 'rgba(56, 189, 248, 0.3)', 
                      borderRadius: '8px',
                      color: '#fff' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#tempGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No temperature observations recorded for {selectedCity}
              </div>
            )}
          </div>
        </div>

        {/* Severity Distribution Donut Chart */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <ShieldAlert size={20} style={{ color: 'var(--heat-medium)' }} />
              Thermal Risk Distribution ({selectedCity})
            </h2>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f1c3a', 
                      borderColor: 'rgba(56, 189, 248, 0.3)', 
                      borderRadius: '8px',
                      color: '#fff' 
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No classification records for {selectedCity}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Reports & Cooling Shelters Quickview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Recent Heat Reports */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Compass size={20} style={{ color: 'var(--accent-cyan)' }} />
              Recent Observations ({selectedCity})
            </h2>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.8rem' }}
              onClick={() => setActiveTab('admin')}
            >
              Manage Reports &rarr;
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Thermal Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.slice(0, 6).map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.location}</td>
                  <td>
                    <span style={{ 
                      color: r.temperature >= 40 ? '#ef4444' : r.temperature >= 30 ? '#f59e0b' : '#10b981',
                      fontWeight: 700 
                    }}>
                      {r.temperature}°C
                    </span>
                  </td>
                  <td>{r.humidity != null ? `${r.humidity}%` : 'N/A'}</td>
                  <td>{getSeverityPill(r.severity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cooling Shelters Capacity Overview */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Building2 size={20} style={{ color: 'var(--cooling-hub)' }} />
              Relief Shelters ({selectedCity})
            </h2>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.8rem' }}
              onClick={() => setActiveTab('cooling')}
            >
              View All &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCooling.slice(0, 4).map((c) => {
              const occupancyPct = c.capacity > 0 ? Math.round(((c.capacity - c.availableSlots) / c.capacity) * 100) : 0;
              const isHigh = c.availableSlots <= (c.capacity * 0.25);
              return (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: isHigh ? '#f87171' : '#34d399', 
                      fontWeight: 700 
                    }}>
                      {c.availableSlots} slots open
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.address}</p>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${occupancyPct}%`,
                        background: isHigh ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #06b6d4, #38bdf8)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {filteredCooling.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '10px 0' }}>
                No registered cooling shelters in {selectedCity} yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
