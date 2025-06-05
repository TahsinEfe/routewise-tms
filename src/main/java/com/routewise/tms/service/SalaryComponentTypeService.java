package com.routewise.tms.service;

import com.routewise.tms.dto.SalaryComponentTypeDto;
import com.routewise.tms.model.SalaryComponentType;
import com.routewise.tms.repository.SalaryComponentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryComponentTypeService {

    private final SalaryComponentTypeRepository salaryComponentTypeRepository;

    public SalaryComponentTypeDto addComponentType(SalaryComponentTypeDto dto) {
        if (salaryComponentTypeRepository.existsByComponentTypeName(dto.getComponentTypeName())) {
            throw new IllegalArgumentException("Bu isimde bir maaş bileşen tipi zaten var!");
        }
        SalaryComponentType type = SalaryComponentType.builder()
                .componentTypeName(dto.getComponentTypeName())
                .description(dto.getDescription())
                .build();
        type = salaryComponentTypeRepository.save(type);
        return toDto(type);
    }

    public void deleteComponentType(Integer componentTypeId) {
        salaryComponentTypeRepository.deleteById(componentTypeId);
    }

    public List<SalaryComponentTypeDto> getAll() {
        return salaryComponentTypeRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SalaryComponentTypeDto toDto(SalaryComponentType type) {
        return SalaryComponentTypeDto.builder()
                .componentTypeId(type.getComponentTypeId())
                .componentTypeName(type.getComponentTypeName())
                .description(type.getDescription())
                .build();
    }
}
