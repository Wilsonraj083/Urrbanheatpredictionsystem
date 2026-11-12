package com.example.urbanheat.service;

import com.example.urbanheat.dto.DashboardStatsDTO;
import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.repository.CoolingLocationRepository;
import com.example.urbanheat.repository.HeatReportRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class DashboardService {

    private final HeatReportRepository heatReportRepository;
    private final CoolingLocationRepository coolingLocationRepository;

    public DashboardService(HeatReportRepository heatReportRepository,
                            CoolingLocationRepository coolingLocationRepository) {
        this.heatReportRepository = heatReportRepository;
        this.coolingLocationRepository = coolingLocationRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        List<HeatReport> allReports = heatReportRepository.findAll();
        List<CoolingLocation> allCoolingLocations = coolingLocationRepository.findAll();

        long totalReports = allReports.size();
        long highCount = allReports.stream().filter(r -> "HIGH".equalsIgnoreCase(r.getSeverity())).count();
        long mediumCount = allReports.stream().filter(r -> "MEDIUM".equalsIgnoreCase(r.getSeverity())).count();
        long lowCount = allReports.stream().filter(r -> "LOW".equalsIgnoreCase(r.getSeverity())).count();

        long totalCooling = allCoolingLocations.size();
        long totalCapacity = allCoolingLocations.stream().mapToLong(CoolingLocation::getCapacity).sum();
        long totalAvailableSlots = allCoolingLocations.stream().mapToLong(CoolingLocation::getAvailableSlots).sum();
        long totalOccupiedSlots = Math.max(0, totalCapacity - totalAvailableSlots);

        double avgTemp = 0.0;
        if (!allReports.isEmpty()) {
            double sum = allReports.stream().mapToDouble(HeatReport::getTemperature).sum();
            avgTemp = BigDecimal.valueOf(sum / allReports.size())
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        // Return up to 10 latest reports
        List<HeatReport> recentReports = allReports.stream()
                .sorted((a, b) -> {
                    if (a.getId() != null && b.getId() != null) {
                        return b.getId().compareTo(a.getId());
                    }
                    return 0;
                })
                .limit(10)
                .toList();

        return new DashboardStatsDTO(
                totalReports,
                highCount,
                mediumCount,
                lowCount,
                totalCooling,
                totalCapacity,
                totalAvailableSlots,
                totalOccupiedSlots,
                avgTemp,
                recentReports,
                allCoolingLocations
        );
    }
}
