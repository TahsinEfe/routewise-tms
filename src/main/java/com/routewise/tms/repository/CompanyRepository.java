package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
    
    // Optional: Add custom methods for finding companies
    Optional<Company> findByCompanyName(String companyName);
    
    @Query("SELECT c FROM Company c WHERE c.companyEmail = ?1")
    Optional<Company> findByCompanyEmail(String email);
    
    // Check if company exists
    boolean existsByCompanyName(String companyName);
}