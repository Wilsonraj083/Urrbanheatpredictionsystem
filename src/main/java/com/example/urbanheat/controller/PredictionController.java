package com.example.urbanheat.controller;

import com.example.urbanheat.dto.PredictionRequest;
import com.example.urbanheat.model.HeatPrediction;
import com.example.urbanheat.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService service;

    public PredictionController(PredictionService service) {
        this.service = service;
    }

    @PostMapping
    public HeatPrediction predict(@Valid @RequestBody PredictionRequest request) {
        return service.predictHeatRisk(request);
    }

    @GetMapping
    public List<HeatPrediction> getAllPredictions() {
        return service.getAllPredictions();
    }

    @GetMapping("/{id}")
    public HeatPrediction getPredictionById(@PathVariable Long id) {
        return service.getPredictionById(id);
    }
}
