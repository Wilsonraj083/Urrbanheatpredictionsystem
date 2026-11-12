package com.example.urbanheat.dto;

import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.model.HeatReport;

import java.util.List;

public class DashboardStatsDTO {

    private long totalHeatReports;
    private long highRiskCount;
    private long mediumRiskCount;
    private long lowRiskCount;

    private long totalCoolingCentres;
    private long totalCapacity;
    private long totalAvailableSlots;
    private long totalOccupiedSlots;

    private double averageTemperature;

    private List<HeatReport> recentReports;
    private List<CoolingLocation> coolingLocations;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalHeatReports, long highRiskCount, long mediumRiskCount,
                             long lowRiskCount, long totalCoolingCentres, long totalCapacity,
                             long totalAvailableSlots, long totalOccupiedSlots,
                             double averageTemperature, List<HeatReport> recentReports,
                             List<CoolingLocation> coolingLocations) {
        this.totalHeatReports = totalHeatReports;
        this.highRiskCount = highRiskCount;
        this.mediumRiskCount = mediumRiskCount;
        this.lowRiskCount = lowRiskCount;
        this.totalCoolingCentres = totalCoolingCentres;
        this.totalCapacity = totalCapacity;
        this.totalAvailableSlots = totalAvailableSlots;
        this.totalOccupiedSlots = totalOccupiedSlots;
        this.averageTemperature = averageTemperature;
        this.recentReports = recentReports;
        this.coolingLocations = coolingLocations;
    }

    public long getTotalHeatReports() {
        return totalHeatReports;
    }

    public void setTotalHeatReports(long totalHeatReports) {
        this.totalHeatReports = totalHeatReports;
    }

    public long getHighRiskCount() {
        return highRiskCount;
    }

    public void setHighRiskCount(long highRiskCount) {
        this.highRiskCount = highRiskCount;
    }

    public long getMediumRiskCount() {
        return mediumRiskCount;
    }

    public void setMediumRiskCount(long mediumRiskCount) {
        this.mediumRiskCount = mediumRiskCount;
    }

    public long getLowRiskCount() {
        return lowRiskCount;
    }

    public void setLowRiskCount(long lowRiskCount) {
        this.lowRiskCount = lowRiskCount;
    }

    public long getTotalCoolingCentres() {
        return totalCoolingCentres;
    }

    public void setTotalCoolingCentres(long totalCoolingCentres) {
        this.totalCoolingCentres = totalCoolingCentres;
    }

    public long getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(long totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public long getTotalAvailableSlots() {
        return totalAvailableSlots;
    }

    public void setTotalAvailableSlots(long totalAvailableSlots) {
        this.totalAvailableSlots = totalAvailableSlots;
    }

    public long getTotalOccupiedSlots() {
        return totalOccupiedSlots;
    }

    public void setTotalOccupiedSlots(long totalOccupiedSlots) {
        this.totalOccupiedSlots = totalOccupiedSlots;
    }

    public double getAverageTemperature() {
        return averageTemperature;
    }

    public void setAverageTemperature(double averageTemperature) {
        this.averageTemperature = averageTemperature;
    }

    public List<HeatReport> getRecentReports() {
        return recentReports;
    }

    public void setRecentReports(List<HeatReport> recentReports) {
        this.recentReports = recentReports;
    }

    public List<CoolingLocation> getCoolingLocations() {
        return coolingLocations;
    }

    public void setCoolingLocations(List<CoolingLocation> coolingLocations) {
        this.coolingLocations = coolingLocations;
    }
}
