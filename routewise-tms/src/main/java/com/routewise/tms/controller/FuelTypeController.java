package com.routewise.tms.controller;

import com.routewise.tms.dto.FuelTypeDto;
import com.routewise.tms.service.IFuelTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-types")
@RequiredArgsConstructor
@Tag(name = "FuelTypes", description = "Fuel Type management APIs")
public class FuelTypeController {

    private final IFuelTypeService fuelTypeService;

    @PostMapping
    @Operation(summary = "Create a new fuel type")
    public ResponseEntity<FuelTypeDto> create(@RequestBody FuelTypeDto dto) {
        return ResponseEntity.ok(fuelTypeService.createFuelType(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a fuel type")
    public ResponseEntity<FuelTypeDto> update(@PathVariable Integer id, @RequestBody FuelTypeDto dto) {
        return ResponseEntity.ok(fuelTypeService.updateFuelType(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a fuel type")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        fuelTypeService.deleteFuelType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a fuel type by ID")
    public ResponseEntity<FuelTypeDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(fuelTypeService.getFuelTypeById(id));
    }

    @GetMapping
    @Operation(summary = "Get all fuel types")
    public ResponseEntity<List<FuelTypeDto>> getAll() {
        return ResponseEntity.ok(fuelTypeService.getAllFuelTypes());
    }
}
