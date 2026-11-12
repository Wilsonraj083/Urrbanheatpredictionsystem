package com.example.urbanheat.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "cooling_locations")
public class CoolingLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @Min(value = 0, message = "Capacity must be non-negative")
    private int capacity;

    @Min(value = 0, message = "Available slots must be non-negative")
    private int availableSlots;

    private Double latitude;
    private Double longitude;

    public CoolingLocation() {
    }

    public CoolingLocation(Long id, String name,
                           String address, int capacity,
                           int availableSlots) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.capacity = capacity;
        this.availableSlots = availableSlots;
    }

    public CoolingLocation(Long id, String name, String address, int capacity,
                           int availableSlots, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.capacity = capacity;
        this.availableSlots = availableSlots;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(int availableSlots) {
        this.availableSlots = availableSlots;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
