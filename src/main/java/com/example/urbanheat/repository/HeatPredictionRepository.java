package com.example.urbanheat.repository;

import com.example.urbanheat.model.HeatPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeatPredictionRepository extends JpaRepository<HeatPrediction, Long> {
    List<HeatPrediction> findAllByOrderByCreatedAtDesc();
}
