package com.example.urbanheat.service;

import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.repository.CoolingLocationRepository;
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
class CoolingLocationServiceTest {

    @Mock
    private CoolingLocationRepository repository;

    @InjectMocks
    private CoolingLocationService service;

    @Test
    @DisplayName("getAllLocations returns all cooling centers from repository")
    void getAllLocations_ReturnsList() {
        CoolingLocation loc1 = new CoolingLocation(1L, "Civic Center Hub", "123 Main St", 100, 45);
        CoolingLocation loc2 = new CoolingLocation(2L, "Community Library", "456 Oak Ave", 60, 20);
        when(repository.findAll()).thenReturn(List.of(loc1, loc2));

        List<CoolingLocation> results = service.getAllLocations();

        assertEquals(2, results.size());
        assertEquals("Civic Center Hub", results.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("addLocation successfully saves valid cooling center")
    void addLocation_ValidInput_SavesSuccessfully() {
        CoolingLocation input = new CoolingLocation(null, "Metro Cooling Center", "789 Pine Rd", 150, 80);
        when(repository.save(any(CoolingLocation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CoolingLocation saved = service.addLocation(input);

        assertNotNull(saved);
        assertEquals("Metro Cooling Center", saved.getName());
        assertEquals("789 Pine Rd", saved.getAddress());
        assertEquals(150, saved.getCapacity());
        assertEquals(80, saved.getAvailableSlots());
        verify(repository, times(1)).save(input);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    @DisplayName("addLocation throws exception when name is blank")
    void addLocation_ThrowsException_WhenNameIsBlank(String blankName) {
        CoolingLocation input = new CoolingLocation(null, blankName, "789 Pine Rd", 100, 50);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Name is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addLocation throws exception when name is null")
    void addLocation_ThrowsException_WhenNameIsNull() {
        CoolingLocation input = new CoolingLocation(null, null, "789 Pine Rd", 100, 50);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Name is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    @DisplayName("addLocation throws exception when address is blank")
    void addLocation_ThrowsException_WhenAddressIsBlank(String blankAddress) {
        CoolingLocation input = new CoolingLocation(null, "West Center", blankAddress, 100, 50);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Address is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addLocation throws exception when address is null")
    void addLocation_ThrowsException_WhenAddressIsNull() {
        CoolingLocation input = new CoolingLocation(null, "West Center", null, 100, 50);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Address is required", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addLocation throws exception when capacity is negative")
    void addLocation_ThrowsException_WhenCapacityNegative() {
        CoolingLocation input = new CoolingLocation(null, "West Center", "123 Elm St", -10, 0);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Invalid capacity or available slots", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addLocation throws exception when available slots is negative")
    void addLocation_ThrowsException_WhenAvailableSlotsNegative() {
        CoolingLocation input = new CoolingLocation(null, "West Center", "123 Elm St", 100, -5);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Invalid capacity or available slots", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("addLocation throws exception when available slots exceeds capacity")
    void addLocation_ThrowsException_WhenAvailableSlotsGreaterThanCapacity() {
        CoolingLocation input = new CoolingLocation(null, "West Center", "123 Elm St", 50, 51);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addLocation(input)
        );

        assertEquals("Invalid capacity or available slots", exception.getMessage());
        verify(repository, never()).save(any());
    }
}
