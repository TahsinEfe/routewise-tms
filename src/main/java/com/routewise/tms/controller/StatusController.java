package com.routewise.tms.controller;

import com.routewise.tms.dto.StatusDto;
import com.routewise.tms.service.IStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
@RequiredArgsConstructor
@Tag(name = "Statuses", description = "Order/Tracking Status Management APIs")
public class StatusController {
    private final IStatusService statusService;

    @PostMapping
    @Operation(summary = "Create a new status")
    public ResponseEntity<StatusDto> create(@RequestBody StatusDto dto) {
        return ResponseEntity.ok(statusService.createStatus(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a status")
    public ResponseEntity<StatusDto> update(@PathVariable Integer id, @RequestBody StatusDto dto) {
        return ResponseEntity.ok(statusService.updateStatus(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a status")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        statusService.deleteStatus(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a status by id")
    public ResponseEntity<StatusDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(statusService.getStatusById(id));
    }

    @GetMapping
    @Operation(summary = "Get all statuses")
    public ResponseEntity<List<StatusDto>> getAll() {
        return ResponseEntity.ok(statusService.getAllStatuses());
    }
}
