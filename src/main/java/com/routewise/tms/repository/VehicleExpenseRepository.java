package com.routewise.tms.repository;

import com.routewise.tms.model.VehicleExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleExpenseRepository extends JpaRepository<VehicleExpense, Integer> {
    List<VehicleExpense> findByVehicleId(Integer vehicleId);
    List<VehicleExpense> findByCompanyId(Integer companyId);
    List<VehicleExpense> findByCategoryId(Integer categoryId);
}
