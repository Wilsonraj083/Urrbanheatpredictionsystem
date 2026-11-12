package com.example.urbanheat.controller;

import com.example.urbanheat.dto.PredictionRequest;
import com.example.urbanheat.exception.GlobalExceptionHandler;
import com.example.urbanheat.model.HeatPrediction;
import com.example.urbanheat.service.PredictionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PredictionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PredictionService service;

    @InjectMocks
    private PredictionController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/predictions generates prediction and returns 200")
    void predict_ValidInput_ReturnsOk() throws Exception {
        HeatPrediction pred = new HeatPrediction(
                1L, "George Town", 42.0, 60.0, 10.0, 84.5, "HIGH",
                "High thermal risk", "Drink water and seek shade"
        );

        when(service.predictHeatRisk(any(PredictionRequest.class))).thenReturn(pred);

        String json = """
                {
                    "location": "George Town",
                    "temperature": 42.0,
                    "humidity": 60.0,
                    "greenCoverPercentage": 10.0
                }
                """;

        mockMvc.perform(post("/api/predictions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location", is("George Town")))
                .andExpect(jsonPath("$.heatRiskScore", is(84.5)))
                .andExpect(jsonPath("$.riskCategory", is("HIGH")));
    }

    @Test
    @DisplayName("GET /api/predictions returns prediction history")
    void getAllPredictions_ReturnsList() throws Exception {
        when(service.getAllPredictions()).thenReturn(List.of(
                new HeatPrediction(1L, "Marina", 35.0, 70.0, 20.0, 55.0, "MEDIUM", "Moderate", "Hydrate")
        ));

        mockMvc.perform(get("/api/predictions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].location", is("Marina")));
    }
}
