package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// [Design Pattern: Domain Model / Entity]
// Açıklama: Veritabanındaki employee_types tablosunun nesne temsilini sağlar.
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employee_types")
public class EmployeeType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeTypeId;

    @Column(nullable = false, unique = true, length = 100)
    private String employeeTypeName;

    @Column(length = 255)
    private String description;
}

