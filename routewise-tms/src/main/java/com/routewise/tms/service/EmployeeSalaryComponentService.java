package com.routewise.tms.service;

import com.routewise.tms.dto.EmployeeSalaryComponentDto;
import com.routewise.tms.model.EmployeeSalaryComponent;
import com.routewise.tms.repository.EmployeeSalaryComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeSalaryComponentService {

    private final EmployeeSalaryComponentRepository repository;

    public EmployeeSalaryComponentDto add(EmployeeSalaryComponentDto dto) {
        EmployeeSalaryComponent entity = EmployeeSalaryComponent.builder()
                .employeeId(dto.getEmployeeId())
                .componentId(dto.getComponentId())
                .amount(dto.getAmount())
                .build();
        entity = repository.save(entity);
        return toDto(entity);
    }

    public void delete(Integer employeeId, Integer componentId) {
        repository.deleteById(new EmployeeSalaryComponent.EmployeeSalaryComponentId(employeeId, componentId));
    }

    public List<EmployeeSalaryComponentDto> getByEmployeeId(Integer employeeId) {
        return repository.findByEmployeeId(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EmployeeSalaryComponentDto> getByComponentId(Integer componentId) {
        return repository.findByComponentId(componentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EmployeeSalaryComponentDto> getAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EmployeeSalaryComponentDto toDto(EmployeeSalaryComponent entity) {
        return EmployeeSalaryComponentDto.builder()
                .employeeId(entity.getEmployeeId())
                .componentId(entity.getComponentId())
                .amount(entity.getAmount())
                .build();
    }
}
