package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryComponentTypeDto {
    private Integer componentTypeId;
    private String componentTypeName;
    private String description;
}
