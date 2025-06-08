package com.routewise.tms.repository;

import com.routewise.tms.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Integer> {
    List<Payroll> findByEmployeeId(Integer employeeId);
    List<Payroll> findByCompanyId(Integer companyId);
}
