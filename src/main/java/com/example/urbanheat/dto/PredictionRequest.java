package com.example.urbanheat.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PredictionRequest {

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
    private Double greenCoverPercentage = 15.0;

    public PredictionRequest() {
    }

    public PredictionRequest(String location, Double temperature, Double humidity, Double greenCoverPercentage) {
        this.location = location;
        this.temperature = temperature;
        this.humidity = humidity;
        this.greenCoverPercentage = greenCoverPercentage;
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
}
