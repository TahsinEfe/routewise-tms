package com.routewise.tms.service;

import com.routewise.tms.dto.EmployeeTypeDto;

import java.util.List;


// [Design Pattern: Service Interface]
// Açıklama: Servis katmanının soyut tanımını yapar, bağımlılıkları azaltır.
public interface IEmployeeTypeService {
    EmployeeTypeDto createEmployeeType(EmployeeTypeDto dto);
    EmployeeTypeDto updateEmployeeType(Integer id, EmployeeTypeDto dto);
    List<EmployeeTypeDto> getAllEmployeeTypes();
    EmployeeTypeDto getEmployeeTypeById(Integer id);
    void deleteEmployeeType(Integer id);
}
