package com.routewise.tms.service;

import com.routewise.tms.dto.OrderRouteDto;
import com.routewise.tms.model.OrderRoute;
import com.routewise.tms.model.OrderRouteId;
import com.routewise.tms.repository.OrderRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service Layer Pattern
@Service
@RequiredArgsConstructor
public class OrderRouteService {

    private final OrderRouteRepository orderRouteRepository;

    // created by Builder Pattern  DTO-Entity layer
    public OrderRouteDto addOrderRoute(OrderRouteDto dto) {
        OrderRoute orderRoute = OrderRoute.builder()
                .orderId(dto.getOrderId())
                .routeId(dto.getRouteId())
                .build();
        orderRoute = orderRouteRepository.save(orderRoute);
        return OrderRouteDto.builder()
                .orderId(orderRoute.getOrderId())
                .routeId(orderRoute.getRouteId())
                .build();
    }

    public void deleteOrderRoute(Integer orderId, Integer routeId) {
        orderRouteRepository.deleteById(new OrderRouteId(orderId, routeId));
    }

    public List<OrderRouteDto> getAll() {
        return orderRouteRepository.findAll()
                .stream()
                .map(or -> OrderRouteDto.builder()
                        .orderId(or.getOrderId())
                        .routeId(or.getRouteId())
                        .build())
                .collect(Collectors.toList());
    }
}
