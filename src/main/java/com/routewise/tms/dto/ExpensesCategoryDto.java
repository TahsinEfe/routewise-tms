package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpensesCategoryDto {
    private Integer categoryId;
    private String categoryName;
    private String description;
}
