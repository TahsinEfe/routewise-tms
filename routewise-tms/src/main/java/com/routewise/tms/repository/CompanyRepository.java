package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> findByCompanyName(String companyName);

    @Query("SELECT c FROM Company c WHERE c.companyEmail = ?1")
    Optional<Company> findByCompanyEmail(String email);

    boolean existsByCompanyName(String companyName);

    // Soft delete için silinmemişleri listele
    List<Company> findAllByIsDeletedFalse();

    // Soft delete için tekili getirirken silinmemiş mi kontrol et
    Optional<Company> findByCompanyIdAndIsDeletedFalse(Integer companyId);
}