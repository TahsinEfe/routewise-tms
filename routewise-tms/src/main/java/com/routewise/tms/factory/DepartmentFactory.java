package com.routewise.tms.factory;

import com.routewise.tms.dto.DepartmentDto;
import com.routewise.tms.model.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentFactory {
    public Department createDepartment(DepartmentDto dto) {
        return Department.builder()
                .departmentName(dto.getDepartmentName())
                .description(dto.getDescription())
                .build();
    }
}
