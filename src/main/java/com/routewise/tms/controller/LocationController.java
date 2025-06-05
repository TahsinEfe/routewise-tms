package com.routewise.tms.controller;

import com.routewise.tms.dto.LocationDto;
import com.routewise.tms.service.ILocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Locations", description = "Location management APIs")
public class LocationController {

    private final ILocationService locationService;

    @PostMapping
    @Operation(summary = "Create new location")
    public ResponseEntity<LocationDto> createLocation(@RequestBody LocationDto dto) {
        return ResponseEntity.ok(locationService.createLocation(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a location")
    public ResponseEntity<LocationDto> updateLocation(@PathVariable Integer id, @RequestBody LocationDto dto) {
        return ResponseEntity.ok(locationService.updateLocation(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a location")
    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get location by id")
    public ResponseEntity<LocationDto> getLocation(@PathVariable Integer id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }

    @GetMapping
    @Operation(summary = "List all locations")
    public ResponseEntity<List<LocationDto>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
}
