package com.routewise.tms.service;

import com.routewise.tms.dto.DepartmentDto;

import java.util.List;

public interface IDepartmentService {
    DepartmentDto createDepartment(DepartmentDto dto);
    DepartmentDto updateDepartment(Integer id, DepartmentDto dto);
    void deleteDepartment(Integer id);
    DepartmentDto getDepartmentById(Integer id);
    List<DepartmentDto> getAllDepartments();
}
