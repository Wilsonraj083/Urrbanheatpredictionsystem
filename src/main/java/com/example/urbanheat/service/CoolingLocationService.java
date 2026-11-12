package com.example.urbanheat.service;

import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.repository.CoolingLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoolingLocationService {

    private final CoolingLocationRepository repository;

    public CoolingLocationService(CoolingLocationRepository repository) {
        this.repository = repository;
    }

    public List<CoolingLocation> getAllLocations() {
        return repository.findAll();
    }

    public CoolingLocation getLocationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cooling location not found with id: " + id));
    }

    public CoolingLocation addLocation(CoolingLocation location) {
        validate(location);
        return repository.save(location);
    }

    public CoolingLocation updateLocation(Long id, CoolingLocation updatedLocation) {
        CoolingLocation existing = getLocationById(id);
        validate(updatedLocation);

        existing.setName(updatedLocation.getName());
        existing.setAddress(updatedLocation.getAddress());
        existing.setCapacity(updatedLocation.getCapacity());
        existing.setAvailableSlots(updatedLocation.getAvailableSlots());
        if (updatedLocation.getLatitude() != null) {
            existing.setLatitude(updatedLocation.getLatitude());
        }
        if (updatedLocation.getLongitude() != null) {
            existing.setLongitude(updatedLocation.getLongitude());
        }

        return repository.save(existing);
    }

    public void deleteLocation(Long id) {
        CoolingLocation existing = getLocationById(id);
        repository.delete(existing);
    }

    private void validate(CoolingLocation location) {
        if (location.getName() == null ||
                location.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (location.getAddress() == null ||
                location.getAddress().isBlank()) {
            throw new IllegalArgumentException("Address is required");
        }

        if (location.getCapacity() < 0 ||
                location.getAvailableSlots() < 0 ||
                location.getAvailableSlots() > location.getCapacity()) {
            throw new IllegalArgumentException("Invalid capacity or available slots");
        }
    }
}