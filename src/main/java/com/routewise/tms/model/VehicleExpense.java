package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "vehicle_expenses")
public class VehicleExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer expenseId;

    @Column(nullable = false)
    private Integer vehicleId;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(nullable = false)
    private Integer categoryId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private Integer companyId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
