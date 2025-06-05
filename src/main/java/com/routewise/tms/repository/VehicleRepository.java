package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import com.routewise.tms.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findAllByCompanyAndIsDeletedFalse(Company company);
    List<Vehicle> findAllByIsDeletedFalse();
}
