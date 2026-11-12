package com.example.urbanheat.repository;

import com.example.urbanheat.model.HeatReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeatReportRepository extends JpaRepository<HeatReport, Long> {
    long countBySeverity(String severity);
    List<HeatReport> findBySeverity(String severity);
    List<HeatReport> findAllByOrderByIdDesc();
}