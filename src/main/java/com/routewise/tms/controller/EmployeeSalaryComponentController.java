package com.routewise.tms.controller;

import com.routewise.tms.dto.EmployeeSalaryComponentDto;
import com.routewise.tms.service.EmployeeSalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-salary-components")
@RequiredArgsConstructor
public class EmployeeSalaryComponentController {

    private final EmployeeSalaryComponentService service;

    @PostMapping
    public ResponseEntity<EmployeeSalaryComponentDto> add(@RequestBody EmployeeSalaryComponentDto dto) {
        return ResponseEntity.ok(service.add(dto));
    }

    @DeleteMapping("/{employeeId}/{componentId}")
    public ResponseEntity<Void> delete(@PathVariable Integer employeeId, @PathVariable Integer componentId) {
        service.delete(employeeId, componentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSalaryComponentDto>> getByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(service.getByEmployeeId(employeeId));
    }

    @GetMapping("/component/{componentId}")
    public ResponseEntity<List<EmployeeSalaryComponentDto>> getByComponentId(@PathVariable Integer componentId) {
        return ResponseEntity.ok(service.getByComponentId(componentId));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeSalaryComponentDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
