package com.routewise.tms.repository;

import com.routewise.tms.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findAllByIsDeletedFalse();
}
