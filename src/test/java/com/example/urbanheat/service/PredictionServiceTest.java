package com.example.urbanheat.service;

import com.example.urbanheat.dto.PredictionRequest;
import com.example.urbanheat.model.HeatPrediction;
import com.example.urbanheat.repository.HeatPredictionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock
    private HeatPredictionRepository repository;

    @InjectMocks
    private PredictionService service;

    @Test
    @DisplayName("Predict heat risk for extreme high temperature returns EXTREME/HIGH risk category")
    void predict_HighThermalStress_ReturnsExtremeOrHigh() {
        when(repository.save(any(HeatPrediction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PredictionRequest req = new PredictionRequest("Industrial Zone", 43.0, 70.0, 5.0);
        HeatPrediction result = service.predictHeatRisk(req);

        assertNotNull(result);
        assertEquals("Industrial Zone", result.getLocation());
        assertTrue(result.getHeatRiskScore() >= 65.0, "Score should be high/extreme for 43C and 70% humidity");
        assertTrue(List.of("HIGH", "EXTREME").contains(result.getRiskCategory()));
        assertNotNull(result.getRiskExplanation());
        assertNotNull(result.getPreventiveMeasures());
        verify(repository, times(1)).save(any(HeatPrediction.class));
    }

    @Test
    @DisplayName("Predict heat risk for cool canopy returns LOW risk category")
    void predict_LowThermalStress_ReturnsLow() {
        when(repository.save(any(HeatPrediction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PredictionRequest req = new PredictionRequest("Botanical Sanctuary", 24.0, 45.0, 75.0);
        HeatPrediction result = service.predictHeatRisk(req);

        assertNotNull(result);
        assertEquals("LOW", result.getRiskCategory());
        assertTrue(result.getHeatRiskScore() < 35.0);
    }

    @Test
    @DisplayName("Predict heat risk with blank location throws IllegalArgumentException")
    void predict_BlankLocation_ThrowsException() {
        PredictionRequest req = new PredictionRequest("", 32.0, 50.0, 20.0);
        assertThrows(IllegalArgumentException.class, () -> service.predictHeatRisk(req));
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Predict heat risk with out of range temperature throws IllegalArgumentException")
    void predict_InvalidTemp_ThrowsException() {
        PredictionRequest req = new PredictionRequest("Area 51", 85.0, 50.0, 20.0);
        assertThrows(IllegalArgumentException.class, () -> service.predictHeatRisk(req));
        verify(repository, never()).save(any());
    }
}
