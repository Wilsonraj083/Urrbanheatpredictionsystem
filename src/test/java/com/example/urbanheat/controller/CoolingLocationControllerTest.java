package com.example.urbanheat.controller;

import com.example.urbanheat.exception.GlobalExceptionHandler;
import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.service.CoolingLocationService;
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
class CoolingLocationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CoolingLocationService service;

    @InjectMocks
    private CoolingLocationController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/cooling-locations returns 200 and list of locations")
    void getAllLocations_ReturnsOk() throws Exception {
        when(service.getAllLocations()).thenReturn(List.of(
                new CoolingLocation(1L, "Riverside Community Center", "500 River Way", 100, 45)
        ));

        mockMvc.perform(get("/api/cooling-locations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Riverside Community Center")));
    }

    @Test
    @DisplayName("POST /api/cooling-locations with valid input returns 200 and saved entity")
    void addLocation_ValidInput_ReturnsOk() throws Exception {
        when(service.addLocation(any(CoolingLocation.class))).thenReturn(
                new CoolingLocation(1L, "Riverside Community Center", "500 River Way", 100, 45)
        );

        String validJson = """
                {
                    "name": "Riverside Community Center",
                    "address": "500 River Way",
                    "capacity": 100,
                    "availableSlots": 45
                }
                """;

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Riverside Community Center")))
                .andExpect(jsonPath("$.address", is("500 River Way")))
                .andExpect(jsonPath("$.capacity", is(100)))
                .andExpect(jsonPath("$.availableSlots", is(45)));
    }

    @Test
    @DisplayName("POST /api/cooling-locations with blank name returns 400 Bad Request")
    void addLocation_BlankName_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "name": "   ",
                    "address": "500 River Way",
                    "capacity": 100,
                    "availableSlots": 45
                }
                """;

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Name is required")));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addLocation(any());
    }

    @Test
    @DisplayName("POST /api/cooling-locations with blank address returns 400 Bad Request")
    void addLocation_BlankAddress_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "name": "Riverside Center",
                    "address": "",
                    "capacity": 100,
                    "availableSlots": 45
                }
                """;

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Address is required")));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addLocation(any());
    }

    @Test
    @DisplayName("POST /api/cooling-locations with negative capacity returns 400 Bad Request")
    void addLocation_NegativeCapacity_ReturnsBadRequest() throws Exception {
        String invalidJson = """
                {
                    "name": "South Pavilion",
                    "address": "200 South Rd",
                    "capacity": -10,
                    "availableSlots": 0
                }
                """;

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", anyOf(
                        containsString("Invalid capacity or available slots"),
                        containsString("Capacity must be non-negative"),
                        containsString("capacity")
                )));

        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).addLocation(any());
    }

    @Test
    @DisplayName("POST /api/cooling-locations with available slots > capacity returns 400 Bad Request")
    void addLocation_SlotsGreaterThanCapacity_ReturnsBadRequest() throws Exception {
        when(service.addLocation(any(CoolingLocation.class)))
                .thenThrow(new IllegalArgumentException("Invalid capacity or available slots"));

        String invalidJson = """
                {
                    "name": "South Pavilion",
                    "address": "200 South Rd",
                    "capacity": 50,
                    "availableSlots": 60
                }
                """;

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Invalid capacity or available slots")));
    }

    @Test
    @DisplayName("POST /api/cooling-locations with malformed JSON body returns 400 Bad Request")
    void addLocation_MalformedJson_ReturnsBadRequest() throws Exception {
        String malformedJson = "{ name: incomplete ";

        mockMvc.perform(post("/api/cooling-locations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Malformed JSON request body")));
    }

    @Test
    @DisplayName("GET /api/cooling-locations/{id} returns cooling location")
    void getLocationById_ReturnsLocation() throws Exception {
        when(service.getLocationById(1L)).thenReturn(
                new CoolingLocation(1L, "Marina Cooling Hub", "Marina Beach", 100, 75)
        );

        mockMvc.perform(get("/api/cooling-locations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Marina Cooling Hub")));
    }

    @Test
    @DisplayName("DELETE /api/cooling-locations/{id} deletes location and returns success")
    void deleteLocation_ReturnsOk() throws Exception {
        org.mockito.Mockito.doNothing().when(service).deleteLocation(1L);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/cooling-locations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));
    }
}
