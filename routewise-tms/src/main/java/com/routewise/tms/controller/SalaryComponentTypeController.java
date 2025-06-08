package com.routewise.tms.controller;

import com.routewise.tms.dto.SalaryComponentTypeDto;
import com.routewise.tms.service.SalaryComponentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-component-types")
@RequiredArgsConstructor
public class SalaryComponentTypeController {

    private final SalaryComponentTypeService salaryComponentTypeService;

    @PostMapping
    public ResponseEntity<SalaryComponentTypeDto> addComponentType(@RequestBody SalaryComponentTypeDto dto) {
        return ResponseEntity.ok(salaryComponentTypeService.addComponentType(dto));
    }

    @DeleteMapping("/{componentTypeId}")
    public ResponseEntity<Void> deleteComponentType(@PathVariable Integer componentTypeId) {
        salaryComponentTypeService.deleteComponentType(componentTypeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SalaryComponentTypeDto>> getAllComponentTypes() {
        return ResponseEntity.ok(salaryComponentTypeService.getAll());
    }
}