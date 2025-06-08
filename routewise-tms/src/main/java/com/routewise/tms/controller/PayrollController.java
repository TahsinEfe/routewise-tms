package com.routewise.tms.controller;

import com.routewise.tms.dto.PayrollDto;
import com.routewise.tms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    public ResponseEntity<PayrollDto> addPayroll(@RequestBody PayrollDto dto) {
        return ResponseEntity.ok(payrollService.addPayroll(dto));
    }

    @DeleteMapping("/{payrollId}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Integer payrollId) {
        payrollService.deletePayroll(payrollId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PayrollDto>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollDto>> getByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(payrollService.getByEmployeeId(employeeId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<PayrollDto>> getByCompanyId(@PathVariable Integer companyId) {
        return ResponseEntity.ok(payrollService.getByCompanyId(companyId));
    }
}
