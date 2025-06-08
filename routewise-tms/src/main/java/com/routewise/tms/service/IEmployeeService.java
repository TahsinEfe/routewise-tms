package com.routewise.tms.service;

import com.routewise.tms.dto.EmployeeDto;

import java.util.List;

public interface IEmployeeService {
    EmployeeDto createEmployee(EmployeeDto dto);
    List<EmployeeDto> getAllEmployees();
    EmployeeDto getEmployeeById(Integer id);
    EmployeeDto updateEmployee(Integer id, EmployeeDto dto);
    void deleteEmployee(Integer employeeId);
}
