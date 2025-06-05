package com.routewise.tms.service;

import com.routewise.tms.dto.EmployeeDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.EmployeeFactory;
import com.routewise.tms.model.*;
import com.routewise.tms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements IEmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final EmployeeTypeRepository employeeTypeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeFactory employeeFactory;

    @Override
    public EmployeeDto createEmployee(EmployeeDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        UserEntity user = dto.getUserId() != null ? userRepository.findById(dto.getUserId()).orElse(null) : null;
        EmployeeType type = dto.getEmployeeTypeId() != null ? employeeTypeRepository.findById(dto.getEmployeeTypeId()).orElse(null) : null;
        Department department = dto.getDepartmentId() != null ? departmentRepository.findById(dto.getDepartmentId()).orElse(null) : null;

        Employee employee = employeeFactory.createEmployee(dto, company, user, type, department);
        Employee saved = employeeRepository.save(employee);
        return mapToDto(saved);
    }

    @Override
    public EmployeeDto updateEmployee(Integer id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        UserEntity user = dto.getUserId() != null ? userRepository.findById(dto.getUserId()).orElse(null) : null;
        EmployeeType type = dto.getEmployeeTypeId() != null ? employeeTypeRepository.findById(dto.getEmployeeTypeId()).orElse(null) : null;
        Department department = dto.getDepartmentId() != null ? departmentRepository.findById(dto.getDepartmentId()).orElse(null) : null;

        updateEmployeeFromDto(employee, dto, company, user, type, department);
        Employee updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public EmployeeDto getEmployeeById(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .filter(e -> !Boolean.TRUE.equals(e.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToDto(employee);
    }

    @Override
    public void deleteEmployee(Integer employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employee.setIsDeleted(true);
        employeeRepository.save(employee);
    }

    // Mapping methods
    private EmployeeDto mapToDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setPhone(employee.getPhone());
        dto.setAddress(employee.getAddress());
        dto.setEmail(employee.getEmail());
        dto.setHireDate(employee.getHireDate());
        dto.setEmployeeTypeId(employee.getEmployeeType() != null ? employee.getEmployeeType().getEmployeeTypeId() : null);
        dto.setDepartmentId(employee.getDepartment() != null ? employee.getDepartment().getDepartmentId() : null);
        dto.setUserId(employee.getUser() != null ? employee.getUser().getUserId() : null);
        dto.setCompanyId(employee.getCompany() != null ? employee.getCompany().getCompanyId() : null);
        return dto;
    }

    private void updateEmployeeFromDto(Employee employee, EmployeeDto dto, Company company, UserEntity user, EmployeeType type, Department department) {
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setEmail(dto.getEmail());
        employee.setHireDate(dto.getHireDate());
        employee.setEmployeeType(type);
        employee.setDepartment(department);
        employee.setUser(user);
        employee.setCompany(company);
    }
}
