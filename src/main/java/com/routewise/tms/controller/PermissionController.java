package com.routewise.tms.controller;

import com.routewise.tms.dto.PermissionDto;
import com.routewise.tms.service.IPermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// GoF: Controller/Service/Factory
@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Tag(name = "Permissions", description = "Permission management APIs")
public class PermissionController {

    private final IPermissionService permissionService;

    @PostMapping
    @Operation(summary = "Create a new permission")
    public ResponseEntity<PermissionDto> create(@RequestBody PermissionDto dto) {
        return ResponseEntity.ok(permissionService.createPermission(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a permission")
    public ResponseEntity<PermissionDto> update(@PathVariable Integer id, @RequestBody PermissionDto dto) {
        return ResponseEntity.ok(permissionService.updatePermission(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a permission")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a permission by ID")
    public ResponseEntity<PermissionDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(permissionService.getPermissionById(id));
    }

    @GetMapping
    @Operation(summary = "Get all permissions")
    public ResponseEntity<List<PermissionDto>> getAll() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }
}
