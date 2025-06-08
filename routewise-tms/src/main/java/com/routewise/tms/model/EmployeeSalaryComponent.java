package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employee_salary_components")
@IdClass(EmployeeSalaryComponent.EmployeeSalaryComponentId.class) // Composite key
public class EmployeeSalaryComponent {

    @Id
    private Integer employeeId;

    @Id
    private Integer componentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Composite key  inner class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeSalaryComponentId implements Serializable {
        private Integer employeeId;
        private Integer componentId;
    }
}
