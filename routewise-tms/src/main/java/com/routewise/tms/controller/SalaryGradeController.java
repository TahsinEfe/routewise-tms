package com.routewise.tms.controller;

import com.routewise.tms.dto.SalaryGradeDto;
import com.routewise.tms.service.SalaryGradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-grades")
@RequiredArgsConstructor
public class SalaryGradeController {

    private final SalaryGradeService salaryGradeService;

    @PostMapping
    public ResponseEntity<SalaryGradeDto> addSalaryGrade(@RequestBody SalaryGradeDto dto) {
        return ResponseEntity.ok(salaryGradeService.addSalaryGrade(dto));
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<Void> deleteSalaryGrade(@PathVariable Integer gradeId) {
        salaryGradeService.deleteSalaryGrade(gradeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SalaryGradeDto>> getAllSalaryGrades() {
        return ResponseEntity.ok(salaryGradeService.getAll());
    }
}
