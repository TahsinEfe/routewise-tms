package com.routewise.tms.repository;

import com.routewise.tms.model.EmployeeSalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeSalaryComponentRepository extends JpaRepository<EmployeeSalaryComponent, EmployeeSalaryComponent.EmployeeSalaryComponentId> {
    List<EmployeeSalaryComponent> findByEmployeeId(Integer employeeId);
    List<EmployeeSalaryComponent> findByComponentId(Integer componentId);
}
