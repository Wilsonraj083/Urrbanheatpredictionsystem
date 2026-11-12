import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import HeatMapPage from './pages/HeatMapPage';
import CoolingCentresPage from './pages/CoolingCentresPage';
import AdminPage from './pages/AdminPage';
import api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState(null);
  const [heatReports, setHeatReports] = useState([]);
  const [coolingLocations, setCoolingLocations] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const loadAllData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [statsData, reportsData, coolingData, predictionsData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getHeatReports().catch(() => []),
        api.getCoolingLocations().catch(() => []),
        api.getPredictions().catch(() => []),
      ]);

      if (statsData || reportsData.length > 0) {
        setBackendOnline(true);
      }

      setStats(statsData);
      setHeatReports(reportsData);
      setCoolingLocations(coolingData);
      setPredictions(predictionsData);

      if (isManualRefresh) {
        showToast('System data synchronized with Spring Boot REST API', 'success');
      }
    } catch (err) {
      setBackendOnline(false);
      showToast('Unable to connect to Spring Boot at http://localhost:8080', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Screen Layout */}
      <div className="main-layout">
        <Header 
          activeTab={activeTab} 
          onRefresh={() => loadAllData(true)}
          isRefreshing={isRefreshing}
          backendOnline={backendOnline}
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            <div className="status-badge" style={{ padding: '12px 24px', fontSize: '1rem', marginBottom: '16px' }}>
              <span className="pulse-dot"></span>
              Connecting to Urban Heat Spring Boot Service...
            </div>
            <p style={{ fontSize: '0.85rem' }}>Verifying http://localhost:8080/api</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage 
                stats={stats} 
                heatReports={heatReports} 
                coolingLocations={coolingLocations}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'prediction' && (
              <PredictionPage 
                predictions={predictions} 
                setPredictions={setPredictions} 
                showToast={showToast} 
              />
            )}

            {activeTab === 'map' && (
              <HeatMapPage 
                heatReports={heatReports} 
                coolingLocations={coolingLocations} 
              />
            )}

            {activeTab === 'cooling' && (
              <CoolingCentresPage 
                coolingLocations={coolingLocations} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'admin' && (
              <AdminPage 
                heatReports={heatReports} 
                coolingLocations={coolingLocations} 
                onRefresh={() => loadAllData(false)}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
