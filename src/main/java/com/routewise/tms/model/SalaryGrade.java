package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "salary_grades")
public class SalaryGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gradeId;

    @Column(nullable = false, unique = true, length = 50)
    private String gradeName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal minSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxSalary;

    @Column(length = 255)
    private String description;
}
