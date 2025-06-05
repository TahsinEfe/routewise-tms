package com.routewise.tms.repository;

import com.routewise.tms.model.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuelTypeRepository extends JpaRepository<FuelType, Integer> {
    Optional<FuelType> findByFuelTypeName(String name);
    boolean existsByFuelTypeName(String name);
}
