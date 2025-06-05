package com.routewise.tms.dto;

import lombok.Data;


// [Design Pattern: DTO (Data Transfer Object)]
// Açıklama: Controller ve Service katmanları arasında veri transferini sadeleştirir.
@Data
public class EmployeeTypeDto {
    private Integer employeeTypeId;
    private String employeeTypeName;
    private String description;
}
