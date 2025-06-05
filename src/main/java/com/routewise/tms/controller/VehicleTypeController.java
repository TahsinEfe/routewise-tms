package com.routewise.tms.controller;

import com.routewise.tms.dto.VehicleTypeDto;
import com.routewise.tms.service.IVehicleTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@RequiredArgsConstructor
@Tag(name = "VehicleTypes", description = "Vehicle Type Management APIs")
public class VehicleTypeController {
    private final IVehicleTypeService vehicleTypeService;

    @PostMapping
    @Operation(summary = "Create a new vehicle type")
    public ResponseEntity<VehicleTypeDto> create(@RequestBody VehicleTypeDto dto) {
        return ResponseEntity.ok(vehicleTypeService.createVehicleType(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a vehicle type")
    public ResponseEntity<VehicleTypeDto> update(@PathVariable Integer id, @RequestBody VehicleTypeDto dto) {
        return ResponseEntity.ok(vehicleTypeService.updateVehicleType(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a vehicle type")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vehicleTypeService.deleteVehicleType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a vehicle type by id")
    public ResponseEntity<VehicleTypeDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vehicleTypeService.getVehicleTypeById(id));
    }

    @GetMapping
    @Operation(summary = "Get all vehicle types")
    public ResponseEntity<List<VehicleTypeDto>> getAll() {
        return ResponseEntity.ok(vehicleTypeService.getAllVehicleTypes());
    }
}
