package com.example.urbanheat.controller;

import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.service.HeatReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/heat-reports")
public class HeatReportController {

    private final HeatReportService service;

    public HeatReportController(HeatReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<HeatReport> getAllReports() {
        return service.getAllReports();
    }

    @GetMapping("/{id}")
    public HeatReport getReportById(@PathVariable Long id) {
        return service.getReportById(id);
    }

    @PostMapping
    public HeatReport addReport(@Valid @RequestBody HeatReport report) {
        return service.addReport(report);
    }

    @PutMapping("/{id}")
    public HeatReport updateReport(@PathVariable Long id, @Valid @RequestBody HeatReport report) {
        return service.updateReport(id, report);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteReport(@PathVariable Long id) {
        service.deleteReport(id);
        return ResponseEntity.ok(Map.of(
                "message", "Heat report deleted successfully",
                "id", id
        ));
    }
}
