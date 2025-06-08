package com.routewise.tms.factory;

import com.routewise.tms.dto.EmployeeDto;
import com.routewise.tms.model.*;
import org.springframework.stereotype.Component;

@Component
public class EmployeeFactory {
    public Employee createEmployee(EmployeeDto dto, Company company, UserEntity user, EmployeeType type, Department department) {
        return Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .hireDate(dto.getHireDate())
                .company(company)
                .user(user)
                .employeeType(type)
                .department(department)
                .isDeleted(false)
                .build();
    }
}
