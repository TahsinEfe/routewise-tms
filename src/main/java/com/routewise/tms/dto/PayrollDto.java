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
public class PayrollDto {
    private Integer payrollId;
    private Integer employeeId;
    private LocalDate paymentDate;
    private BigDecimal totalEarnings;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private Integer companyId;
    private LocalDateTime createdAt;
}
