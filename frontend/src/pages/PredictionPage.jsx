import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Trees, 
  Droplets, 
  Thermometer, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  History,
  Building,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';

const CITY_PRESETS = [
  {
    name: 'Custom City / District (Enter Your Own)',
    location: '',
    temperature: 38.0,
    humidity: 60,
    greenCover: 20,
    type: 'custom'
  },
  {
    name: 'Delhi NCR — Connaught Place (Extreme Continental Heat)',
    location: 'Connaught Place Asphalt Hub, Delhi',
    temperature: 44.5,
    humidity: 35,
    greenCover: 10,
    type: 'extreme'
  },
  {
    name: 'Delhi — Chandni Chowk (High-Density Old City)',
    location: 'Chandni Chowk Market Core, Delhi',
    temperature: 43.8,
    humidity: 38,
    greenCover: 8,
    type: 'high'
  },
  {
    name: 'Mumbai — Bandra Kurla Complex (High Coastal Humid Heat)',
    location: 'Bandra Kurla Complex (BKC), Mumbai',
    temperature: 39.2,
    humidity: 82,
    greenCover: 14,
    type: 'high'
  },
  {
    name: 'Mumbai — Dharavi Core (Severe Concrete Heat Island)',
    location: 'Dharavi Dense Urban Core, Mumbai',
    temperature: 40.4,
    humidity: 79,
    greenCover: 5,
    type: 'extreme'
  },
  {
    name: 'Chennai — T. Nagar Core (Commercial Urban Heat)',
    location: 'T. Nagar Commercial Core, Chennai',
    temperature: 41.8,
    humidity: 64,
    greenCover: 8,
    type: 'high'
  },
  {
    name: 'Chennai — Marina Beach (Coastal Thermal Strip)',
    location: 'Marina Beach Coastal Hub, Chennai',
    temperature: 42.5,
    humidity: 72,
    greenCover: 15,
    type: 'high'
  },
  {
    name: 'Bengaluru — Whitefield Tech Corridor (Moderate Concrete UHI)',
    location: 'Whitefield Tech Corridor, Bengaluru',
    temperature: 35.0,
    humidity: 48,
    greenCover: 20,
    type: 'medium'
  },
  {
    name: 'Bengaluru — Cubbon Park (Shaded Vegetative Haven)',
    location: 'Cubbon Park Green Reserve, Bengaluru',
    temperature: 26.2,
    humidity: 54,
    greenCover: 70,
    type: 'low'
  },
  {
    name: 'Hyderabad — HITEC City (Deccan High Heat)',
    location: 'HITEC City Cyber Towers, Hyderabad',
    temperature: 42.4,
    humidity: 40,
    greenCover: 12,
    type: 'high'
  },
  {
    name: 'Kolkata — Howrah Junction (High Humid Gangetic Delta)',
    location: 'Howrah Junction Terminal, Kolkata',
    temperature: 40.8,
    humidity: 78,
    greenCover: 10,
    type: 'high'
  },
  {
    name: 'Ahmedabad — Sabarmati Riverfront (Arid Severe Heat)',
    location: 'Sabarmati Riverfront Commercial Hub, Ahmedabad',
    temperature: 44.0,
    humidity: 28,
    greenCover: 12,
    type: 'extreme'
  },
  {
    name: 'Jaipur — Pink City Historic Walled Quarter (Desert Heat)',
    location: 'Pink City Walled Quarter, Jaipur',
    temperature: 43.2,
    humidity: 30,
    greenCover: 10,
    type: 'high'
  },
  {
    name: 'Pune — Hinjawadi IT Corridor (Plateau Moderate)',
    location: 'Hinjawadi IT Corridor, Pune',
    temperature: 37.5,
    humidity: 52,
    greenCover: 25,
    type: 'medium'
  }
];

export default function PredictionPage({ predictions, setPredictions, showToast }) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1); // Default to Delhi
  const [location, setLocation] = useState(CITY_PRESETS[1].location);
  const [temperature, setTemperature] = useState(CITY_PRESETS[1].temperature);
  const [humidity, setHumidity] = useState(CITY_PRESETS[1].humidity);
  const [greenCover, setGreenCover] = useState(CITY_PRESETS[1].greenCover);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(predictions[0] || null);

  const handlePresetChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedPresetIndex(idx);
    const preset = CITY_PRESETS[idx];
    if (preset) {
      if (preset.type !== 'custom') {
        setLocation(preset.location);
        setTemperature(preset.temperature);
        setHumidity(preset.humidity);
        setGreenCover(preset.greenCover);
      } else {
        setLocation('');
      }
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      showToast('Please specify a valid city or district location name', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        location: location.trim(),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        greenCoverPercentage: parseFloat(greenCover)
      };

      const newPrediction = await api.predictHeatRisk(payload);
      setResult(newPrediction);
      setPredictions([newPrediction, ...predictions]);
      showToast(`Heat Risk evaluated for ${newPrediction.location}: ${newPrediction.riskCategory} (${newPrediction.heatRiskScore}/100)`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to estimate heat risk', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#dc2626';
    if (score >= 65) return '#ef4444';
    if (score >= 35) return '#f59e0b';
    return '#10b981';
  };

  const scoreColor = result ? getScoreColor(result.heatRiskScore) : '#38bdf8';

  return (
    <div className="page-container">
      {/* City Preset Selection Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
            <Building size={20} style={{ color: 'var(--accent-cyan)' }} />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Quick City Microclimate Profile / Preset:
              </label>
              <select 
                className="form-select"
                value={selectedPresetIndex}
                onChange={handlePresetChange}
                style={{ cursor: 'pointer' }}
              >
                {CITY_PRESETS.map((p, idx) => (
                  <option key={idx} value={idx} style={{ background: '#0f1c3a', color: '#fff' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
            💡 <strong style={{ color: '#fff' }}>Simulate Any City:</strong> Pick a realistic baseline above or enter custom sensor readings for any metropolitan region.
          </div>
        </div>
      </div>

      <div className="prediction-grid">
        {/* Left Form: Parameter Inputs */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
              Configure Environmental Variables
            </h2>
          </div>

          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label className="form-label">Target City / District Location</label>
              <input 
                type="text" 
                className="form-input" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="e.g. Connaught Place, Delhi OR your desired city"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} style={{ color: '#ef4444' }} />
                    Ambient Temp (°C)
                  </span>
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="-50" 
                  max="70" 
                  className="form-input" 
                  value={temperature} 
                  onChange={(e) => setTemperature(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={14} style={{ color: '#38bdf8' }} />
                    Relative Humidity (%)
                  </span>
                </label>
                <input 
                  type="number" 
                  step="1" 
                  min="0" 
                  max="100" 
                  className="form-input" 
                  value={humidity} 
                  onChange={(e) => setHumidity(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trees size={14} style={{ color: '#10b981' }} />
                    Vegetation & Tree Canopy Cover
                  </span>
                </label>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
                  {greenCover}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={greenCover} 
                onChange={(e) => setGreenCover(e.target.value)} 
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Higher vegetative cover provides natural shading and evapotranspiration relief against the Urban Heat Island (UHI) effect.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
              disabled={loading}
            >
              <Flame size={18} />
              <span>{loading ? 'Evaluating Biometeorological Model...' : 'Calculate Heat-Risk Score'}</span>
            </button>
          </form>
        </div>

        {/* Right Output: Estimation Score & Actionable Plan */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">
              <ShieldAlert size={20} style={{ color: scoreColor }} />
              Estimated Risk Assessment Result
            </h2>
            {result && (
              <span className={`severity-pill ${result.riskCategory.toLowerCase()}`}>
                {result.riskCategory}
              </span>
            )}
          </div>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div className="gauge-wrapper" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div 
                  className="score-circle" 
                  style={{ 
                    border: `4px solid ${scoreColor}`,
                    background: `radial-gradient(circle, ${scoreColor}18 0%, rgba(15,28,58,0.8) 75%)`,
                    boxShadow: `0 0 35px ${scoreColor}40`
                  }}
                >
                  <span className="score-number" style={{ color: scoreColor }}>
                    {result.heatRiskScore}
                  </span>
                  <span className="score-label">Out of 100</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                  {result.location}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Evaluated at {new Date(result.createdAt || Date.now()).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Scientific Biometeorological Explanation
                </h4>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6', color: '#e2e8f0' }}>
                  {result.riskExplanation}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Municipal Preventive Action Protocol
                </h4>
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-line', color: '#f1f5f9' }}>
                  {result.preventiveMeasures}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
              <Info size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>Configure parameters on the left to calculate an estimated heat-risk score.</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Predictions Audit Log */}
      <div className="glass-card" style={{ marginTop: '28px' }}>
        <div className="card-header">
          <h2 className="card-title">
            <History size={20} style={{ color: 'var(--accent-cyan)' }} />
            Recent Simulation & Assessment History (All Cities)
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Persisted in H2 Database</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>City / Location</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>Green Cover</th>
              <th>Risk Score</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {predictions.slice(0, 10).map((p) => (
              <tr key={p.id || Math.random()}>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() + ' ' + new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </td>
                <td style={{ fontWeight: 600 }}>{p.location}</td>
                <td>{p.temperature}°C</td>
                <td>{p.humidity}%</td>
                <td>{p.greenCoverPercentage != null ? `${p.greenCoverPercentage}%` : 'N/A'}</td>
                <td style={{ fontWeight: 700, color: getScoreColor(p.heatRiskScore) }}>
                  {p.heatRiskScore} / 100
                </td>
                <td>
                  <span className={`severity-pill ${p.riskCategory.toLowerCase()}`}>
                    {p.riskCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
