package com.example.urbanheat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.urbanheat.model.CoolingLocation;

@Repository
public interface CoolingLocationRepository extends JpaRepository<CoolingLocation, Long> {
}