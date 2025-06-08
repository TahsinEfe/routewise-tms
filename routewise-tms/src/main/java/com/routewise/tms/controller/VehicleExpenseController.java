package com.routewise.tms.controller;

import com.routewise.tms.dto.VehicleExpenseDto;
import com.routewise.tms.service.VehicleExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-expenses")
@RequiredArgsConstructor
public class VehicleExpenseController {

    private final VehicleExpenseService vehicleExpenseService;

    @PostMapping
    public ResponseEntity<VehicleExpenseDto> addVehicleExpense(@RequestBody VehicleExpenseDto dto) {
        return ResponseEntity.ok(vehicleExpenseService.addVehicleExpense(dto));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteVehicleExpense(@PathVariable Integer expenseId) {
        vehicleExpenseService.deleteVehicleExpense(expenseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<VehicleExpenseDto>> getAllVehicleExpenses() {
        return ResponseEntity.ok(vehicleExpenseService.getAll());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<VehicleExpenseDto>> getByVehicleId(@PathVariable Integer vehicleId) {
        return ResponseEntity.ok(vehicleExpenseService.getByVehicleId(vehicleId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<VehicleExpenseDto>> getByCompanyId(@PathVariable Integer companyId) {
        return ResponseEntity.ok(vehicleExpenseService.getByCompanyId(companyId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<VehicleExpenseDto>> getByCategoryId(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(vehicleExpenseService.getByCategoryId(categoryId));
    }
}