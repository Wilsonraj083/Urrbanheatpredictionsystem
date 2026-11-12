package com.example.urbanheat.service;

import com.example.urbanheat.dto.DashboardStatsDTO;
import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.repository.CoolingLocationRepository;
import com.example.urbanheat.repository.HeatReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private HeatReportRepository heatReportRepository;

    @Mock
    private CoolingLocationRepository coolingLocationRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    @DisplayName("Compute dashboard stats correctly aggregates reports and cooling metrics")
    void getDashboardStats_AggregatesCorrectly() {
        List<HeatReport> reports = List.of(
                new HeatReport(1L, "Loc 1", 42.0, "HIGH"),
                new HeatReport(2L, "Loc 2", 34.0, "MEDIUM"),
                new HeatReport(3L, "Loc 3", 26.0, "LOW")
        );

        List<CoolingLocation> locations = List.of(
                new CoolingLocation(1L, "Center A", "Address A", 100, 60),
                new CoolingLocation(2L, "Center B", "Address B", 50, 20)
        );

        when(heatReportRepository.findAll()).thenReturn(reports);
        when(coolingLocationRepository.findAll()).thenReturn(locations);

        DashboardStatsDTO stats = dashboardService.getDashboardStats();

        assertEquals(3, stats.getTotalHeatReports());
        assertEquals(1, stats.getHighRiskCount());
        assertEquals(1, stats.getMediumRiskCount());
        assertEquals(1, stats.getLowRiskCount());
        assertEquals(2, stats.getTotalCoolingCentres());
        assertEquals(150, stats.getTotalCapacity());
        assertEquals(80, stats.getTotalAvailableSlots());
        assertEquals(70, stats.getTotalOccupiedSlots());
        assertEquals(34.0, stats.getAverageTemperature());
        assertEquals(3, stats.getRecentReports().size());
    }
}
