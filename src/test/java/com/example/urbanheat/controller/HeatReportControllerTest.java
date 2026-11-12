package com.example.urbanheat.controller;

import com.example.urbanheat.exception.GlobalExceptionHandler;
import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.service.HeatReportService;
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
class HeatReportControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HeatReportService service;

    @InjectMocks
    private HeatReportController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/heat-reports returns 200 and list of reports")
    void getAllReports_ReturnsOk() throws Exception {
        when(service.getAllReports()).thenReturn(List.of(
                new HeatReport(1L, "Central Boulevard", 42.5, "HIGH")
        ));

        mockMvc.perform(get("/api/heat-reports"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].location", is("Central Boulevard")));
    }

    @Test
    @DisplayName("POST /api/heat-reports with valid input returns 200 and saved report")
    void addReport_ValidInput_ReturnsOk() throws Exception {
        when(service.addReport(any(HeatReport.class))).thenReturn(
                new HeatReport(1L, "Central Boulevard", 42.5, "HIGH")
        );

        String validJson = """
                {
                    "location": "Central Boulevard",
                    "temperature": 42.5
                }
                """;

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.location", is("Central Boulevard")))
                .andExpect(jsonPath("$.temperature", is(42.5)))
                .andExpect(jsonPath("$.severity", is("HIGH")));
    }

    @Test
    @DisplayName("POST /api/heat-reports with blank location returns 400 Bad Request")
    void addReport_BlankLocation_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "location": "",
                    "temperature": 35.0
                }
                """;

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Location is required")));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addReport(any());
    }

    @Test
    @DisplayName("POST /api/heat-reports with temperature > 70 returns 400 Bad Request")
    void addReport_TempTooHigh_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "location": "Desert Strip",
                    "temperature": 75.0
                }
                """;

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Temperature must be between -50 and 70 Celsius")));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addReport(any());
    }

    @Test
    @DisplayName("POST /api/heat-reports with temperature < -50 returns 400 Bad Request")
    void addReport_TempTooLow_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "location": "Sub-zero Vault",
                    "temperature": -60.0
                }
                """;

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Temperature must be between -50 and 70 Celsius")));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addReport(any());
    }

    @Test
    @DisplayName("POST /api/heat-reports with invalid severity returns 400 Bad Request")
    void addReport_InvalidSeverity_ReturnsBadRequest() throws Exception {
        when(service.addReport(any(HeatReport.class)))
                .thenThrow(new IllegalArgumentException("Severity must be LOW, MEDIUM, or HIGH"));

        String invalidJson = """
                {
                    "location": "North Hills",
                    "temperature": 32.0,
                    "severity": "BOILING"
                }
                """;

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Severity must be LOW, MEDIUM, or HIGH")));
    }

    @Test
    @DisplayName("POST /api/heat-reports with malformed JSON body returns 400 Bad Request")
    void addReport_MalformedJson_ReturnsBadRequest() throws Exception {
        String malformedJson = "{ location: corrupt }";

        mockMvc.perform(post("/api/heat-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Malformed JSON request body")));
    }

    @Test
    @DisplayName("GET /api/heat-reports/{id} returns report")
    void getReportById_ReturnsReport() throws Exception {
        when(service.getReportById(1L)).thenReturn(new HeatReport(1L, "Marina Beach", 42.0, "HIGH"));

        mockMvc.perform(get("/api/heat-reports/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.location", is("Marina Beach")));
    }

    @Test
    @DisplayName("DELETE /api/heat-reports/{id} deletes report and returns success")
    void deleteReport_ReturnsOk() throws Exception {
        org.mockito.Mockito.doNothing().when(service).deleteReport(1L);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/heat-reports/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));
    }
}
