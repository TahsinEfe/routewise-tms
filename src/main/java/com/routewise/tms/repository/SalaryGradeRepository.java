package com.routewise.tms.repository;

import com.routewise.tms.model.SalaryGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryGradeRepository extends JpaRepository<SalaryGrade, Integer> {
    boolean existsByGradeName(String gradeName);
}
