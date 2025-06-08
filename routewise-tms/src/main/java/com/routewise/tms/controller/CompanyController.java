package com.routewise.tms.controller;

import com.routewise.tms.dto.CompanyDto;
import com.routewise.tms.facade.TransportationManagementFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final TransportationManagementFacade facade;

    @PostMapping
    @Operation(summary = "Create a new company")
    public ResponseEntity<CompanyDto> create(@RequestBody CompanyDto dto) {
        return ResponseEntity.ok(facade.createCompany(dto));
    }

    @GetMapping
    @Operation(summary = "Get all companies")
    public ResponseEntity<List<CompanyDto>> getAll() {
        return ResponseEntity.ok(facade.getAllCompanies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a company by ID")
    public ResponseEntity<CompanyDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(facade.getCompanyById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a company")
    public ResponseEntity<CompanyDto> update(@PathVariable Integer id, @RequestBody CompanyDto dto) {
        return ResponseEntity.ok(facade.updateCompany(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a company")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        facade.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
