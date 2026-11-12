package com.example.urbanheat.controller;

import com.example.urbanheat.dto.DashboardStatsDTO;
import com.example.urbanheat.exception.GlobalExceptionHandler;
import com.example.urbanheat.service.DashboardService;
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

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DashboardService service;

    @InjectMocks
    private DashboardController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/dashboard/stats returns 200 and stats payload")
    void getDashboardStats_ReturnsOk() throws Exception {
        DashboardStatsDTO stats = new DashboardStatsDTO(
                10, 4, 4, 2, 5, 500, 320, 180, 37.5,
                Collections.emptyList(), Collections.emptyList()
        );

        when(service.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalHeatReports", is(10)))
                .andExpect(jsonPath("$.highRiskCount", is(4)))
                .andExpect(jsonPath("$.totalCoolingCentres", is(5)))
                .andExpect(jsonPath("$.totalAvailableSlots", is(320)));
    }
}
