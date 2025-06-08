package com.routewise.tms.repository;

import com.routewise.tms.model.EmployeeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


// [Design Pattern: Repository]
// Açıklama: Veritabanı işlemlerini soyutlayarak, persistence katmanını ayrıştırır.
public interface EmployeeTypeRepository extends JpaRepository<EmployeeType, Integer> {
    Optional<EmployeeType> findByEmployeeTypeName(String name);
    boolean existsByEmployeeTypeName(String name);

    // Soft delete desteği eklenirse, burada da eklenebilir.
    // List<EmployeeType> findAllByIsDeletedFalse();
}
