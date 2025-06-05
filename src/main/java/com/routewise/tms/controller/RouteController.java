package com.routewise.tms.controller;

import com.routewise.tms.dto.RouteDto;
import com.routewise.tms.service.IRouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Routes", description = "Route management APIs")
public class RouteController {

    private final IRouteService routeService;

    @PostMapping
    @Operation(summary = "Create a new route")
    public ResponseEntity<RouteDto> create(@RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.createRoute(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a route")
    public ResponseEntity<RouteDto> update(@PathVariable Integer id, @RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.updateRoute(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a route")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all routes")
    public ResponseEntity<List<RouteDto>> getAll() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get route by ID")
    public ResponseEntity<RouteDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }
}