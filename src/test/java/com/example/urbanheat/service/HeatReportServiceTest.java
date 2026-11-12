package com.example.urbanheat.service;

import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.repository.HeatReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HeatReportServiceTest {

    @Mock
    private HeatReportRepository repository;

    @InjectMocks
    private HeatReportService service;

    @Test
    @DisplayName("getAllReports returns reports from repository")
    void getAllReports_ReturnsList() {
        HeatReport report1 = new HeatReport(1L, "Downtown Market", 41.5, "HIGH");
        HeatReport report2 = new HeatReport(2L, "Central Park", 28.0, "LOW");
        when(repository.findAll()).thenReturn(List.of(report1, report2));

        List<HeatReport> results = service.getAllReports();

        assertEquals(2, results.size());
        assertEquals("Downtown Market", results.get(0).getLocation());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("addReport calculates HIGH severity when temperature >= 40 and severity is blank")
    void addReport_CalculatesHighSeverity_WhenTempGte40() {
        HeatReport input = new HeatReport(null, "Industrial Zone", 42.0, "");
        when(repository.save(any(HeatReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HeatReport saved = service.addReport(input);

        assertNotNull(saved);
        assertEquals("HIGH", saved.getSeverity());
        assertEquals("Industrial Zone", saved.getLocation());
        assertEquals(42.0, saved.getTemperature());
        verify(repository, times(1)).save(input);
    }

    @Test
    @DisplayName("addReport calculates MEDIUM severity when temperature between 30 and 39.9")
    void addReport_CalculatesMediumSeverity_WhenTempBetween30And40() {
        HeatReport input = new HeatReport(null, "Suburban Plaza", 34.5, null);
        when(repository.save(any(HeatReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HeatReport saved = service.addReport(input);

        assertNotNull(saved);
        assertEquals("MEDIUM", saved.getSeverity());
    }

    @Test
    @DisplayName("addReport calculates LOW severity when temperature < 30")
    void addReport_CalculatesLowSeverity_WhenTempLessThan30() {
        HeatReport input = new HeatReport(null, "River Promenade", 24.0, null);
        when(repository.save(any(HeatReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HeatReport saved = service.addReport(input);

        assertNotNull(saved);
        assertEquals("LOW", saved.getSeverity());
    }

    @Test
    @DisplayName("addReport preserves valid explicit severity")
    void addReport_PreservesExplicitSeverity() {
        HeatReport input = new HeatReport(null, "City Center", 31.0, "HIGH");
        when(repository.save(any(HeatReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HeatReport saved = service.addReport(input);

        assertEquals("HIGH", saved.getSeverity());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    @DisplayName("addReport throws exception when location is blank")
    void addReport_ThrowsException_WhenLocationIsBlank(String blankLocation) {
        HeatReport input = new HeatReport(null, blankLocation, 35.0, "MEDIUM");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addReport(input)
        );

        assertEquals("Location is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addReport throws exception when location is null")
    void addReport_ThrowsException_WhenLocationIsNull() {
        HeatReport input = new HeatReport(null, null, 35.0, "MEDIUM");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addReport(input)
        );

        assertEquals("Location is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addReport throws exception when temperature is below -50")
    void addReport_ThrowsException_WhenTempTooLow() {
        HeatReport input = new HeatReport(null, "North District", -51.0, "LOW");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addReport(input)
        );

        assertEquals("Temperature must be between -50 and 70 Celsius", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addReport throws exception when temperature is above 70")
    void addReport_ThrowsException_WhenTempTooHigh() {
        HeatReport input = new HeatReport(null, "Desert Highway", 71.5, "HIGH");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addReport(input)
        );

        assertEquals("Temperature must be between -50 and 70 Celsius", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addReport throws exception when severity is invalid string")
    void addReport_ThrowsException_WhenSeverityIsInvalid() {
        HeatReport input = new HeatReport(null, "City Square", 35.0, "EXTREME");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addReport(input)
        );

        assertEquals("Severity must be LOW, MEDIUM, or HIGH", exception.getMessage());
        verify(repository, never()).save(any());
    }
}
