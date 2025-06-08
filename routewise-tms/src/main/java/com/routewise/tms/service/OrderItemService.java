package com.routewise.tms.service;

import com.routewise.tms.dto.OrderItemDto;
import com.routewise.tms.model.OrderItem;
import com.routewise.tms.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service Layer Pattern
@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemDto addOrderItem(OrderItemDto dto) {
        OrderItem item = OrderItem.builder()
                .orderId(dto.getOrderId())
                .itemName(dto.getItemName())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .description(dto.getDescription())
                .build();
        item = orderItemRepository.save(item);
        return toDto(item);
    }

    public List<OrderItemDto> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteOrderItem(Integer orderItemId) {
        orderItemRepository.deleteById(orderItemId);
    }

    public OrderItemDto toDto(OrderItem item) {
        return OrderItemDto.builder()
                .orderItemId(item.getOrderItemId())
                .orderId(item.getOrderId())
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .description(item.getDescription())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
