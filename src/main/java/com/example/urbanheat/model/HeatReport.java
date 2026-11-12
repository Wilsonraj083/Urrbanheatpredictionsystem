package com.example.urbanheat.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "heat_reports")
public class HeatReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Temperature is required")
    @Min(value = -50, message = "Temperature must be between -50 and 70 Celsius")
    @Max(value = 70, message = "Temperature must be between -50 and 70 Celsius")
    private Double temperature;

    private String severity;

    @Min(value = 0, message = "Humidity must be between 0 and 100")
    @Max(value = 100, message = "Humidity must be between 0 and 100")
    private Double humidity;

    private Double latitude;
    private Double longitude;

    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public HeatReport() {
    }

    public HeatReport(Long id, String location,
                      Double temperature, String severity) {
        this.id = id;
        this.location = location;
        this.temperature = temperature;
        this.severity = severity;
        this.createdAt = java.time.LocalDateTime.now();
    }

    public HeatReport(Long id, String location, Double temperature, String severity,
                      Double humidity, Double latitude, Double longitude) {
        this.id = id;
        this.location = location;
        this.temperature = temperature;
        this.severity = severity;
        this.humidity = humidity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = java.time.LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
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

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}