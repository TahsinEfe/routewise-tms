package com.routewise.tms.service;

import com.routewise.tms.dto.OrderDto;
import java.util.List;

public interface IOrderService {
    OrderDto createOrder(OrderDto dto);
    OrderDto updateOrder(Integer id, OrderDto dto);
    List<OrderDto> getAllOrders();
    OrderDto getOrderById(Integer id);
    void deleteOrder(Integer id);
}