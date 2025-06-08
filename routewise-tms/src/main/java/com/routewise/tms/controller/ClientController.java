package com.routewise.tms.controller;

import com.routewise.tms.dto.ClientDto;
import com.routewise.tms.service.IClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Client", description = "Client operations endpoints")
public class ClientController {

    private final IClientService clientService;

    @GetMapping
    @Operation(summary = "All Clients")
    public ResponseEntity<List<ClientDto>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Client depending on ID")
    public ResponseEntity<ClientDto> getClientById(@PathVariable Integer id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PostMapping
    @Operation(summary = "Create new Client")
    public ResponseEntity<ClientDto> createClient(@RequestBody ClientDto dto) {
        return ResponseEntity.ok(clientService.createClient(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Existed Client")
    public ResponseEntity<ClientDto> updateClient(@PathVariable Integer id, @RequestBody ClientDto dto) {
        return ResponseEntity.ok(clientService.updateClient(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft Delete Client")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
