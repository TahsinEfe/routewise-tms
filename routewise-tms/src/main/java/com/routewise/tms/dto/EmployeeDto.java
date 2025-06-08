package com.routewise.tms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeDto {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String email;
    private LocalDate hireDate;
    private Integer employeeTypeId;
    private Integer departmentId;
    private Integer userId;
    private Integer companyId;
}
