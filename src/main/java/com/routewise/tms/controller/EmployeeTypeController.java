package com.routewise.tms.controller;

import com.routewise.tms.dto.EmployeeTypeDto;
import com.routewise.tms.service.IEmployeeTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-types")
@RequiredArgsConstructor
@Tag(name = "EmployeeType", description = "Çalışan tipi yönetimi")
public class EmployeeTypeController {

    private final IEmployeeTypeService employeeTypeService;

    @PostMapping
    @Operation(summary = "Yeni bir çalışan tipi oluştur")
    public ResponseEntity<EmployeeTypeDto> create(@RequestBody EmployeeTypeDto dto) {
        return ResponseEntity.ok(employeeTypeService.createEmployeeType(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Çalışan tipini güncelle")
    public ResponseEntity<EmployeeTypeDto> update(@PathVariable Integer id, @RequestBody EmployeeTypeDto dto) {
        return ResponseEntity.ok(employeeTypeService.updateEmployeeType(id, dto));
    }

    @GetMapping
    @Operation(summary = "Tüm çalışan tiplerini getir")
    public ResponseEntity<List<EmployeeTypeDto>> getAll() {
        return ResponseEntity.ok(employeeTypeService.getAllEmployeeTypes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "ID'ye göre çalışan tipini getir")
    public ResponseEntity<EmployeeTypeDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeTypeService.getEmployeeTypeById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Çalışan tipini sil")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        employeeTypeService.deleteEmployeeType(id);
        return ResponseEntity.noContent().build();
    }
}
