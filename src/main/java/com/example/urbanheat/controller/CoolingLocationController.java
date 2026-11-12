package com.example.urbanheat.controller;

import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.service.CoolingLocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cooling-locations")
public class CoolingLocationController {

    private final CoolingLocationService service;

    public CoolingLocationController(CoolingLocationService service) {
        this.service = service;
    }

    @GetMapping
    public List<CoolingLocation> getAllLocations() {
        return service.getAllLocations();
    }

    @GetMapping("/{id}")
    public CoolingLocation getLocationById(@PathVariable Long id) {
        return service.getLocationById(id);
    }

    @PostMapping
    public CoolingLocation addLocation(@Valid @RequestBody CoolingLocation location) {
        return service.addLocation(location);
    }

    @PutMapping("/{id}")
    public CoolingLocation updateLocation(@PathVariable Long id, @Valid @RequestBody CoolingLocation location) {
        return service.updateLocation(id, location);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteLocation(@PathVariable Long id) {
        service.deleteLocation(id);
        return ResponseEntity.ok(Map.of(
                "message", "Cooling location deleted successfully",
                "id", id
        ));
    }
}