import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Flame, 
  Building2, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import api from '../services/api';

export default function AdminPage({ 
  heatReports, 
  coolingLocations, 
  onRefresh, 
  showToast 
}) {
  const [activeSubTab, setActiveSubTab] = useState('REPORTS'); // 'REPORTS' | 'COOLING'

  // Modal states
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showEditReportModal, setShowEditReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [showAddCoolingModal, setShowAddCoolingModal] = useState(false);
  const [showEditCoolingModal, setShowEditCoolingModal] = useState(false);
  const [selectedCooling, setSelectedCooling] = useState(null);

  // Form states - Heat Report
  const [reportForm, setReportForm] = useState({
    location: '',
    temperature: 38.0,
    humidity: 60.0,
    latitude: 13.045,
    longitude: 80.245
  });

  // Form states - Cooling Centre
  const [coolingForm, setCoolingForm] = useState({
    name: '',
    address: '',
    capacity: 100,
    availableSlots: 75,
    latitude: 13.045,
    longitude: 80.245
  });

  // Action Handlers - Heat Reports
  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      await api.createHeatReport({
        location: reportForm.location.trim(),
        temperature: parseFloat(reportForm.temperature),
        humidity: parseFloat(reportForm.humidity),
        latitude: parseFloat(reportForm.latitude),
        longitude: parseFloat(reportForm.longitude)
      });
      showToast('Heat report created successfully', 'success');
      setShowAddReportModal(false);
      setReportForm({ location: '', temperature: 38.0, humidity: 60.0, latitude: 13.045, longitude: 80.245 });
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    try {
      await api.updateHeatReport(selectedReport.id, {
        location: reportForm.location.trim(),
        temperature: parseFloat(reportForm.temperature),
        humidity: parseFloat(reportForm.humidity),
        latitude: parseFloat(reportForm.latitude),
        longitude: parseFloat(reportForm.longitude)
      });
      showToast('Heat report updated successfully', 'success');
      setShowEditReportModal(false);
      setSelectedReport(null);
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteReport = async (id, loc) => {
    if (!window.confirm(`Are you sure you want to delete heat report for "${loc}"?`)) return;
    try {
      await api.deleteHeatReport(id);
      showToast('Heat report removed', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Action Handlers - Cooling Centres
  const handleCreateCooling = async (e) => {
    e.preventDefault();
    try {
      await api.createCoolingLocation({
        name: coolingForm.name.trim(),
        address: coolingForm.address.trim(),
        capacity: parseInt(coolingForm.capacity, 10),
        availableSlots: parseInt(coolingForm.availableSlots, 10),
        latitude: parseFloat(coolingForm.latitude),
        longitude: parseFloat(coolingForm.longitude)
      });
      showToast('Cooling centre added successfully', 'success');
      setShowAddCoolingModal(false);
      setCoolingForm({ name: '', address: '', capacity: 100, availableSlots: 75, latitude: 13.045, longitude: 80.245 });
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateCooling = async (e) => {
    e.preventDefault();
    try {
      await api.updateCoolingLocation(selectedCooling.id, {
        name: coolingForm.name.trim(),
        address: coolingForm.address.trim(),
        capacity: parseInt(coolingForm.capacity, 10),
        availableSlots: parseInt(coolingForm.availableSlots, 10),
        latitude: parseFloat(coolingForm.latitude),
        longitude: parseFloat(coolingForm.longitude)
      });
      showToast('Cooling centre updated successfully', 'success');
      setShowEditCoolingModal(false);
      setSelectedCooling(null);
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCooling = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete cooling shelter "${name}"?`)) return;
    try {
      await api.deleteCoolingLocation(id);
      showToast('Cooling shelter removed', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Subtab Navigation Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className={`btn-secondary ${activeSubTab === 'REPORTS' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('REPORTS')}
            >
              <Flame size={16} />
              <span>Thermal Reports ({heatReports.length})</span>
            </button>
            <button 
              className={`btn-secondary ${activeSubTab === 'COOLING' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('COOLING')}
            >
              <Building2 size={16} />
              <span>Cooling Shelters ({coolingLocations.length})</span>
            </button>
          </div>

          <div>
            {activeSubTab === 'REPORTS' ? (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setReportForm({ location: '', temperature: 38.0, humidity: 60.0, latitude: 13.045, longitude: 80.245 });
                  setShowAddReportModal(true);
                }}
              >
                <PlusCircle size={17} />
                <span>Add Thermal Observation</span>
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setCoolingForm({ name: '', address: '', capacity: 100, availableSlots: 75, latitude: 13.045, longitude: 80.245 });
                  setShowAddCoolingModal(true);
                }}
              >
                <PlusCircle size={17} />
                <span>Register Cooling Shelter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Heat Reports Management Table */}
      {activeSubTab === 'REPORTS' && (
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Flame size={20} style={{ color: '#ef4444' }} />
              Live Heat Report Database
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-calculates severity via Spring Boot</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Calculated Severity</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {heatReports.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-dim)' }}>#{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.location}</td>
                  <td style={{ 
                    fontWeight: 700, 
                    color: r.temperature >= 40 ? '#ef4444' : r.temperature >= 30 ? '#f59e0b' : '#10b981' 
                  }}>
                    {r.temperature}°C
                  </td>
                  <td>{r.humidity != null ? `${r.humidity}%` : 'N/A'}</td>
                  <td>
                    <span className={`severity-pill ${r.severity?.toLowerCase()}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {r.latitude ? `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}` : 'Auto'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-edit"
                        onClick={() => {
                          setSelectedReport(r);
                          setReportForm({
                            location: r.location,
                            temperature: r.temperature,
                            humidity: r.humidity || 60,
                            latitude: r.latitude || 13.045,
                            longitude: r.longitude || 80.245
                          });
                          setShowEditReportModal(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDeleteReport(r.id, r.location)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cooling Locations Management Table */}
      {activeSubTab === 'COOLING' && (
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <Building2 size={20} style={{ color: 'var(--cooling-hub)' }} />
              Municipal Cooling Centres Database
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time shelter capacity & slot invariants</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Shelter Name</th>
                <th>Address</th>
                <th>Total Capacity</th>
                <th>Available Slots</th>
                <th>Occupancy %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coolingLocations.map((c) => {
                const occupancyPct = c.capacity > 0 ? Math.round(((c.capacity - c.availableSlots) / c.capacity) * 100) : 0;
                return (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-dim)' }}>#{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.address}</td>
                    <td style={{ fontWeight: 600 }}>{c.capacity}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{c.availableSlots}</td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: occupancyPct > 80 ? '#f87171' : '#38bdf8' }}>
                        {occupancyPct}% ({c.capacity - c.availableSlots} occupied)
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-edit"
                          onClick={() => {
                            setSelectedCooling(c);
                            setCoolingForm({
                              name: c.name,
                              address: c.address,
                              capacity: c.capacity,
                              availableSlots: c.availableSlots,
                              latitude: c.latitude || 13.045,
                              longitude: c.longitude || 80.245
                            });
                            setShowEditCoolingModal(true);
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn-danger"
                          onClick={() => handleDeleteCooling(c.id, c.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add Heat Report */}
      {showAddReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ingest Thermal Field Observation</h3>
              <button 
                onClick={() => setShowAddReportModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateReport}>
              <div className="form-group">
                <label className="form-label">Location / Urban Corridor</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  placeholder="e.g. Guindy Industrial Zone"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Temperature (°C)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="-50" 
                    max="70" 
                    className="form-input" 
                    value={reportForm.temperature}
                    onChange={(e) => setReportForm({ ...reportForm, temperature: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Humidity (%)</label>
                  <input 
                    type="number" 
                    step="1" 
                    min="0" 
                    max="100" 
                    className="form-input" 
                    value={reportForm.humidity}
                    onChange={(e) => setReportForm({ ...reportForm, humidity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className="form-input" 
                    value={reportForm.latitude}
                    onChange={(e) => setReportForm({ ...reportForm, latitude: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className="form-input" 
                    value={reportForm.longitude}
                    onChange={(e) => setReportForm({ ...reportForm, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddReportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Heat Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Heat Report */}
      {showEditReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Heat Report #{selectedReport?.id}</h3>
              <button 
                onClick={() => setShowEditReportModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateReport}>
              <div className="form-group">
                <label className="form-label">Location / Urban Corridor</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Temperature (°C)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    value={reportForm.temperature}
                    onChange={(e) => setReportForm({ ...reportForm, temperature: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Humidity (%)</label>
                  <input 
                    type="number" 
                    step="1" 
                    className="form-input" 
                    value={reportForm.humidity}
                    onChange={(e) => setReportForm({ ...reportForm, humidity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEditReportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Cooling Shelter */}
      {showAddCoolingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register Municipal Cooling Shelter</h3>
              <button 
                onClick={() => setShowAddCoolingModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCooling}>
              <div className="form-group">
                <label className="form-label">Shelter Facility Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={coolingForm.name}
                  onChange={(e) => setCoolingForm({ ...coolingForm, name: e.target.value })}
                  placeholder="e.g. Central Air-Conditioned Community Hall"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={coolingForm.address}
                  onChange={(e) => setCoolingForm({ ...coolingForm, address: e.target.value })}
                  placeholder="e.g. 50 Station Road, Chennai"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Total Capacity (Beds/Seats)</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-input" 
                    value={coolingForm.capacity}
                    onChange={(e) => setCoolingForm({ ...coolingForm, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Relief Slots</label>
                  <input 
                    type="number" 
                    min="0" 
                    max={coolingForm.capacity}
                    className="form-input" 
                    value={coolingForm.availableSlots}
                    onChange={(e) => setCoolingForm({ ...coolingForm, availableSlots: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddCoolingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Cooling Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Cooling Shelter */}
      {showEditCoolingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Cooling Shelter #{selectedCooling?.id}</h3>
              <button 
                onClick={() => setShowEditCoolingModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateCooling}>
              <div className="form-group">
                <label className="form-label">Facility Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={coolingForm.name}
                  onChange={(e) => setCoolingForm({ ...coolingForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={coolingForm.address}
                  onChange={(e) => setCoolingForm({ ...coolingForm, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Total Capacity</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-input" 
                    value={coolingForm.capacity}
                    onChange={(e) => setCoolingForm({ ...coolingForm, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Slots</label>
                  <input 
                    type="number" 
                    min="0" 
                    max={coolingForm.capacity}
                    className="form-input" 
                    value={coolingForm.availableSlots}
                    onChange={(e) => setCoolingForm({ ...coolingForm, availableSlots: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEditCoolingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
