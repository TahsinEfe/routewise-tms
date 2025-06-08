package com.routewise.tms.service;

import com.routewise.tms.dto.DepartmentDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.DepartmentFactory;
import com.routewise.tms.model.Department;
import com.routewise.tms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements IDepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentFactory departmentFactory;

    // [Factory Pattern] kullanıldı.
    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {
        Department department = departmentFactory.createDepartment(dto);
        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    @Override
    public DepartmentDto updateDepartment(Integer id, DepartmentDto dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        Department updated = departmentRepository.save(department);
        return mapToDto(updated);
    }

    @Override
    public void deleteDepartment(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        departmentRepository.delete(department); // veya soft-delete uygula!
    }

    @Override
    public DepartmentDto getDepartmentById(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return mapToDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    // Mapping Method (Single Responsibility Principle)
    private DepartmentDto mapToDto(Department department) {
        return DepartmentDto.builder()
                .departmentId(department.getDepartmentId())
                .departmentName(department.getDepartmentName())
                .description(department.getDescription())
                .build();
    }
}
