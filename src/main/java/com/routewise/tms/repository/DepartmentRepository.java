package com.routewise.tms.repository;

import com.routewise.tms.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByDepartmentName(String departmentName);
    List<Department> findAllByIsDeletedFalse();
}
