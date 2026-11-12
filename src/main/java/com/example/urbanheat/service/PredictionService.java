package com.example.urbanheat.service;

import com.example.urbanheat.dto.PredictionRequest;
import com.example.urbanheat.model.HeatPrediction;
import com.example.urbanheat.repository.HeatPredictionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PredictionService {

    private final HeatPredictionRepository repository;

    public PredictionService(HeatPredictionRepository repository) {
        this.repository = repository;
    }

    public List<HeatPrediction> getAllPredictions() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public HeatPrediction getPredictionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prediction record not found with id: " + id));
    }

    public HeatPrediction predictHeatRisk(PredictionRequest request) {
        if (request.getLocation() == null || request.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }
        if (request.getTemperature() == null || request.getTemperature() < -50 || request.getTemperature() > 70) {
            throw new IllegalArgumentException("Temperature must be between -50 and 70 Celsius");
        }
        if (request.getHumidity() == null || request.getHumidity() < 0 || request.getHumidity() > 100) {
            throw new IllegalArgumentException("Humidity must be between 0 and 100");
        }

        double greenCover = (request.getGreenCoverPercentage() != null)
                ? Math.max(0.0, Math.min(100.0, request.getGreenCoverPercentage()))
                : 15.0;

        double temp = request.getTemperature();
        double humidity = request.getHumidity();

        // 1. Base Thermal Load (derived from temperature)
        double tempLoad = Math.max(0, (temp - 15.0) * 1.8);

        // 2. Humidity vapor pressure penalty (evaporative cooling impairment)
        double humidityPenalty = (humidity / 100.0) * (temp > 25.0 ? (temp - 20.0) * 0.9 : 5.0);

        // 3. Raw thermal stress
        double rawStress = tempLoad + humidityPenalty;

        // 4. Urban vegetative mitigation (shading & evapotranspiration reduction factor)
        double greenMitigation = (greenCover / 100.0) * 16.0;

        // 5. Final 0-100 score calculation
        double calculatedScore = Math.max(0.0, Math.min(100.0, rawStress - greenMitigation + 10.0));
        double score = BigDecimal.valueOf(calculatedScore)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();

        // Risk Category mapping
        String category;
        String explanation;
        String recommendations;

        if (score < 35.0) {
            category = "LOW";
            explanation = String.format(
                    "Low thermal discomfort detected for %s (Score: %.1f/100). " +
                    "Ambient temperature of %.1f°C and humidity of %.1f%% are within normal physiological tolerance. " +
                    "Urban vegetative cover (%.1f%%) provides adequate microclimate cooling.",
                    request.getLocation(), score, temp, humidity, greenCover
            );
            recommendations = "• Maintain routine outdoor activities.\n" +
                    "• Stay regularly hydrated with clean drinking water.\n" +
                    "• Ensure standard ventilation in civic and residential facilities.";
        } else if (score < 65.0) {
            category = "MEDIUM";
            explanation = String.format(
                    "Moderate heat-stress vulnerability in %s (Score: %.1f/100). " +
                    "Temperature of %.1f°C combined with %.1f%% humidity causes noticeable thermal discomfort. " +
                    "Green cover of %.1f%% mitigates approximately %.1f points of heat load.",
                    request.getLocation(), score, temp, humidity, greenCover, greenMitigation
            );
            recommendations = "• Limit direct sun exposure between 12:00 PM and 3:30 PM.\n" +
                    "• Hydrate frequently with oral electrolytes.\n" +
                    "• Wear light, loose-fitting cotton clothing and carry sunshades.\n" +
                    "• Municipal monitors should prepare nearby cooling centres for potential overflow.";
        } else if (score < 85.0) {
            category = "HIGH";
            explanation = String.format(
                    "High thermal risk alert for %s (Score: %.1f/100). " +
                    "Elevated temperature (%.1f°C) combined with high humidity (%.1f%%) severely impairs natural body perspiration cooling. " +
                    "Insufficient green buffer (%.1f%%) amplifies the Urban Heat Island (UHI) effect.",
                    request.getLocation(), score, temp, humidity, greenCover
            );
            recommendations = "• Issue civic heat advisory for vulnerable demographics (children, elderly, outdoor workers).\n" +
                    "• Dispatch portable water distribution kiosks to high-footfall intersections.\n" +
                    "• Direct citizens to municipal air-conditioned cooling centres.\n" +
                    "• Halt non-essential strenuous outdoor construction during peak sun hours.";
        } else {
            category = "EXTREME";
            explanation = String.format(
                    "CRITICAL / EXTREME thermal emergency in %s (Score: %.1f/100). " +
                    "Severe combination of %.1f°C and %.1f%% humidity creates life-threatening heat-stress conditions. " +
                    "Sensible heat index exceeds safe human endurance limits.",
                    request.getLocation(), score, temp, humidity
            );
            recommendations = "• EMERGENCY HEAT PROTOCOL: Activate municipal rapid response teams.\n" +
                    "• Open all community cooling hubs at 100%% operating capacity with medical standby.\n" +
                    "• Deploy misting trucks and street water sprinklers across asphalt corridors.\n" +
                    "• Advise all residents to remain indoors in cooled environments.";
        }

        // Clarifying footnote regarding explainable heuristic model
        explanation += "\n[Model Notice: Transparent heuristic biometeorological heat-stress score calculated using Steadman index factors & urban canopy offset; not an experimentally calibrated sensor forecast.]";

        HeatPrediction prediction = new HeatPrediction(
                null,
                request.getLocation(),
                temp,
                humidity,
                greenCover,
                score,
                category,
                explanation,
                recommendations
        );

        return repository.save(prediction);
    }
}
