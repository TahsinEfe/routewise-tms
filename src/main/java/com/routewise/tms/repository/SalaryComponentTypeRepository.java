package com.routewise.tms.repository;

import com.routewise.tms.model.SalaryComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryComponentTypeRepository extends JpaRepository<SalaryComponentType, Integer> {
    boolean existsByComponentTypeName(String componentTypeName);
}
