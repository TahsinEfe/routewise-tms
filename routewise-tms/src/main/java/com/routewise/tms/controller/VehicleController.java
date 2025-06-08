package com.routewise.tms.controller;

import com.routewise.tms.dto.VehicleDto;
import com.routewise.tms.service.IVehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicles", description = "Vehicle Management APIs")
public class VehicleController {
    private final IVehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Create a new vehicle")
    public ResponseEntity<VehicleDto> create(@RequestBody VehicleDto dto) {
        return ResponseEntity.ok(vehicleService.createVehicle(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a vehicle")
    public ResponseEntity<VehicleDto> update(@PathVariable Integer id, @RequestBody VehicleDto dto) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a vehicle")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a vehicle by id")
    public ResponseEntity<VehicleDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping
    @Operation(summary = "Get all vehicles")
    public ResponseEntity<List<VehicleDto>> getAll() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
}
