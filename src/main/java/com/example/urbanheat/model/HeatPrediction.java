package com.example.urbanheat.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "heat_predictions")
public class HeatPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Temperature is required")
    @Min(value = -50, message = "Temperature must be between -50 and 70 Celsius")
    @Max(value = 70, message = "Temperature must be between -50 and 70 Celsius")
    private Double temperature;

    @NotNull(message = "Humidity is required")
    @Min(value = 0, message = "Humidity must be between 0 and 100")
    @Max(value = 100, message = "Humidity must be between 0 and 100")
    private Double humidity;

    @Min(value = 0, message = "Green cover must be between 0 and 100")
    @Max(value = 100, message = "Green cover must be between 0 and 100")
    private Double greenCoverPercentage;

    private Double heatRiskScore;

    private String riskCategory;

    @Column(length = 2000)
    private String riskExplanation;

    @Column(length = 2000)
    private String preventiveMeasures;

    private LocalDateTime createdAt = LocalDateTime.now();

    public HeatPrediction() {
    }

    public HeatPrediction(Long id, String location, Double temperature, Double humidity,
                          Double greenCoverPercentage, Double heatRiskScore,
                          String riskCategory, String riskExplanation,
                          String preventiveMeasures) {
        this.id = id;
        this.location = location;
        this.temperature = temperature;
        this.humidity = humidity;
        this.greenCoverPercentage = greenCoverPercentage;
        this.heatRiskScore = heatRiskScore;
        this.riskCategory = riskCategory;
        this.riskExplanation = riskExplanation;
        this.preventiveMeasures = preventiveMeasures;
        this.createdAt = LocalDateTime.now();
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

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getGreenCoverPercentage() {
        return greenCoverPercentage;
    }

    public void setGreenCoverPercentage(Double greenCoverPercentage) {
        this.greenCoverPercentage = greenCoverPercentage;
    }

    public Double getHeatRiskScore() {
        return heatRiskScore;
    }

    public void setHeatRiskScore(Double heatRiskScore) {
        this.heatRiskScore = heatRiskScore;
    }

    public String getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(String riskCategory) {
        this.riskCategory = riskCategory;
    }

    public String getRiskExplanation() {
        return riskExplanation;
    }

    public void setRiskExplanation(String riskExplanation) {
        this.riskExplanation = riskExplanation;
    }

    public String getPreventiveMeasures() {
        return preventiveMeasures;
    }

    public void setPreventiveMeasures(String preventiveMeasures) {
        this.preventiveMeasures = preventiveMeasures;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
