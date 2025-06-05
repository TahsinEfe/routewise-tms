package com.routewise.tms.controller;

import com.routewise.tms.dto.OrderRouteDto;
import com.routewise.tms.service.OrderRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Facade Pattern
@RestController
@RequestMapping("/api/order-routes")
@RequiredArgsConstructor
public class OrderRouteController {

    private final OrderRouteService orderRouteService;

    @PostMapping
    public ResponseEntity<OrderRouteDto> addOrderRoute(@RequestBody OrderRouteDto dto) {
        return ResponseEntity.ok(orderRouteService.addOrderRoute(dto));
    }

    @DeleteMapping("/{orderId}/{routeId}")
    public ResponseEntity<Void> deleteOrderRoute(@PathVariable Integer orderId, @PathVariable Integer routeId) {
        orderRouteService.deleteOrderRoute(orderId, routeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<OrderRouteDto>> getAllOrderRoutes() {
        return ResponseEntity.ok(orderRouteService.getAll());
    }
}

