package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Integer orderItemId;
    private Integer orderId;
    private String itemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String description;
    private LocalDateTime createdAt;
}
