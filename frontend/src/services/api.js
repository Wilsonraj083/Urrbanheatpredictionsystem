import axios from 'axios';
import { fallbackStorage } from './fallbackData';

const API_BASE_URL = window.location.port === '5173' ? '/api' : 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // Quick fallback if backend is offline on cloud deployment
});

export const api = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return res.data;
    } catch (err) {
      // Cloud Fallback Aggregation
      const reports = fallbackStorage.getReports();
      const cooling = fallbackStorage.getCooling();
      const totalCapacity = cooling.reduce((s, c) => s + (c.capacity || 0), 0);
      const totalAvailable = cooling.reduce((s, c) => s + (c.availableSlots || 0), 0);
      const avgTemp = reports.length > 0
        ? Math.round((reports.reduce((s, r) => s + r.temperature, 0) / reports.length) * 10) / 10
        : 38.5;

      return {
        totalHeatReports: reports.length,
        highRiskCount: reports.filter(r => r.severity === 'HIGH').length,
        mediumRiskCount: reports.filter(r => r.severity === 'MEDIUM').length,
        lowRiskCount: reports.filter(r => r.severity === 'LOW').length,
        totalCoolingCentres: cooling.length,
        totalCapacity,
        totalAvailableSlots: totalAvailable,
        totalOccupiedSlots: Math.max(0, totalCapacity - totalAvailable),
        averageTemperature: avgTemp,
        recentReports: reports.slice(0, 8),
        coolingLocations: cooling
      };
    }
  },

  // Heat Reports CRUD
  getHeatReports: async () => {
    try {
      const res = await apiClient.get('/heat-reports');
      return res.data;
    } catch (err) {
      return fallbackStorage.getReports();
    }
  },

  createHeatReport: async (data) => {
    try {
      const res = await apiClient.post('/heat-reports', data);
      return res.data;
    } catch (err) {
      const reports = fallbackStorage.getReports();
      let severity = 'LOW';
      if (data.temperature >= 40) severity = 'HIGH';
      else if (data.temperature >= 30) severity = 'MEDIUM';

      const newReport = {
        id: Date.now(),
        ...data,
        severity,
        createdAt: new Date().toISOString()
      };
      reports.unshift(newReport);
      fallbackStorage.saveReports(reports);
      return newReport;
    }
  },

  updateHeatReport: async (id, data) => {
    try {
      const res = await apiClient.put(`/heat-reports/${id}`, data);
      return res.data;
    } catch (err) {
      const reports = fallbackStorage.getReports();
      const idx = reports.findIndex(r => r.id === id);
      if (idx !== -1) {
        let severity = 'LOW';
        if (data.temperature >= 40) severity = 'HIGH';
        else if (data.temperature >= 30) severity = 'MEDIUM';
        reports[idx] = { ...reports[idx], ...data, severity };
        fallbackStorage.saveReports(reports);
        return reports[idx];
      }
      return data;
    }
  },

  deleteHeatReport: async (id) => {
    try {
      const res = await apiClient.delete(`/heat-reports/${id}`);
      return res.data;
    } catch (err) {
      const reports = fallbackStorage.getReports().filter(r => r.id !== id);
      fallbackStorage.saveReports(reports);
      return { message: "Report deleted", id };
    }
  },

  // Cooling Locations CRUD
  getCoolingLocations: async () => {
    try {
      const res = await apiClient.get('/cooling-locations');
      return res.data;
    } catch (err) {
      return fallbackStorage.getCooling();
    }
  },

  createCoolingLocation: async (data) => {
    try {
      const res = await apiClient.post('/cooling-locations', data);
      return res.data;
    } catch (err) {
      const cooling = fallbackStorage.getCooling();
      const newLoc = { id: Date.now(), ...data };
      cooling.unshift(newLoc);
      fallbackStorage.saveCooling(cooling);
      return newLoc;
    }
  },

  updateCoolingLocation: async (id, data) => {
    try {
      const res = await apiClient.put(`/cooling-locations/${id}`, data);
      return res.data;
    } catch (err) {
      const cooling = fallbackStorage.getCooling();
      const idx = cooling.findIndex(c => c.id === id);
      if (idx !== -1) {
        cooling[idx] = { ...cooling[idx], ...data };
        fallbackStorage.saveCooling(cooling);
        return cooling[idx];
      }
      return data;
    }
  },

  deleteCoolingLocation: async (id) => {
    try {
      const res = await apiClient.delete(`/cooling-locations/${id}`);
      return res.data;
    } catch (err) {
      const cooling = fallbackStorage.getCooling().filter(c => c.id !== id);
      fallbackStorage.saveCooling(cooling);
      return { message: "Cooling location deleted", id };
    }
  },

  // Heat Risk Prediction
  predictHeatRisk: async (data) => {
    try {
      const res = await apiClient.post('/predictions', data);
      return res.data;
    } catch (err) {
      const newPred = fallbackStorage.calculatePrediction(data);
      const preds = fallbackStorage.getPredictions();
      preds.unshift(newPred);
      fallbackStorage.savePredictions(preds);
      return newPred;
    }
  },

  getPredictions: async () => {
    try {
      const res = await apiClient.get('/predictions');
      return res.data;
    } catch (err) {
      return fallbackStorage.getPredictions();
    }
  },
};

export default api;
