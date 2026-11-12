package com.example.urbanheat.service;

import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.repository.HeatReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HeatReportService {

    private static final List<String> VALID_SEVERITIES = List.of("LOW", "MEDIUM", "HIGH");

    private final HeatReportRepository repository;

    public HeatReportService(HeatReportRepository repository) {
        this.repository = repository;
    }

    public List<HeatReport> getAllReports() {
        return repository.findAll();
    }

    public HeatReport getReportById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Heat report not found with id: " + id));
    }

    public HeatReport addReport(HeatReport report) {
        validateAndNormalize(report);
        if (report.getCreatedAt() == null) {
            report.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(report);
    }

    public HeatReport updateReport(Long id, HeatReport updatedReport) {
        HeatReport existing = getReportById(id);

        validateAndNormalize(updatedReport);

        existing.setLocation(updatedReport.getLocation());
        existing.setTemperature(updatedReport.getTemperature());
        existing.setSeverity(updatedReport.getSeverity());
        existing.setHumidity(updatedReport.getHumidity());
        if (updatedReport.getLatitude() != null) {
            existing.setLatitude(updatedReport.getLatitude());
        }
        if (updatedReport.getLongitude() != null) {
            existing.setLongitude(updatedReport.getLongitude());
        }

        return repository.save(existing);
    }

    public void deleteReport(Long id) {
        HeatReport existing = getReportById(id);
        repository.delete(existing);
    }

    private void validateAndNormalize(HeatReport report) {
        if (report.getLocation() == null ||
                report.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }

        if (report.getTemperature() == null ||
                report.getTemperature() < -50 ||
                report.getTemperature() > 70) {
            throw new IllegalArgumentException(
                    "Temperature must be between -50 and 70 Celsius");
        }

        if (report.getHumidity() != null && (report.getHumidity() < 0 || report.getHumidity() > 100)) {
            throw new IllegalArgumentException("Humidity must be between 0 and 100");
        }

        if (report.getSeverity() == null ||
                report.getSeverity().isBlank()) {
            if (report.getTemperature() >= 40) {
                report.setSeverity("HIGH");
            } else if (report.getTemperature() >= 30) {
                report.setSeverity("MEDIUM");
            } else {
                report.setSeverity("LOW");
            }
        } else {
            String upper = report.getSeverity().trim().toUpperCase();
            if (!VALID_SEVERITIES.contains(upper)) {
                throw new IllegalArgumentException("Severity must be LOW, MEDIUM, or HIGH");
            }
            report.setSeverity(upper);
        }
    }
}