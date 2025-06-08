package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleExpenseDto {
    private Integer expenseId;
    private Integer vehicleId;
    private LocalDate expenseDate;
    private Integer categoryId;
    private String description;
    private BigDecimal amount;
    private Integer companyId;
    private LocalDateTime createdAt;
}
