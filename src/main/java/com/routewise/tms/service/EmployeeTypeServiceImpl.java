package com.routewise.tms.service;

import com.routewise.tms.dto.EmployeeTypeDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.model.EmployeeType;
import com.routewise.tms.repository.EmployeeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeTypeServiceImpl implements IEmployeeTypeService {

    private final EmployeeTypeRepository employeeTypeRepository;

    @Override
    public EmployeeTypeDto createEmployeeType(EmployeeTypeDto dto) {
        EmployeeType type = EmployeeType.builder()
                .employeeTypeName(dto.getEmployeeTypeName())
                .description(dto.getDescription())
                .build();
        EmployeeType saved = employeeTypeRepository.save(type);
        return mapToDto(saved);
    }

    @Override
    public EmployeeTypeDto updateEmployeeType(Integer id, EmployeeTypeDto dto) {
        EmployeeType type = employeeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmployeeType not found"));
        type.setEmployeeTypeName(dto.getEmployeeTypeName());
        type.setDescription(dto.getDescription());
        EmployeeType updated = employeeTypeRepository.save(type);
        return mapToDto(updated);
    }

    @Override
    public List<EmployeeTypeDto> getAllEmployeeTypes() {
        return employeeTypeRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public EmployeeTypeDto getEmployeeTypeById(Integer id) {
        EmployeeType type = employeeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmployeeType not found"));
        return mapToDto(type);
    }

    @Override
    public void deleteEmployeeType(Integer id) {
        employeeTypeRepository.deleteById(id);
    }

    // [Design Pattern: Mapper/Converter Method]
    // Açıklama: Entity <-> DTO dönüşümlerini merkezi olarak yönetir.
    private EmployeeTypeDto mapToDto(EmployeeType type) {
        EmployeeTypeDto dto = new EmployeeTypeDto();
        dto.setEmployeeTypeId(type.getEmployeeTypeId());
        dto.setEmployeeTypeName(type.getEmployeeTypeName());
        dto.setDescription(type.getDescription());
        return dto;
    }
}
