package com.routewise.tms.service;

import com.routewise.tms.dto.OrderDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.OrderFactory;
import com.routewise.tms.model.*;
import com.routewise.tms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final StatusRepository statusRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final OrderFactory orderFactory;

    // --- Factory Pattern Kullanımı ---
    @Override
    public OrderDto createOrder(OrderDto dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        Status status = statusRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        Vehicle vehicle = dto.getAssignedVehicleId() != null ? vehicleRepository.findById(dto.getAssignedVehicleId()).orElse(null) : null;
        Employee driver = dto.getAssignedDriverId() != null ? employeeRepository.findById(dto.getAssignedDriverId()).orElse(null) : null;
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Order order = orderFactory.createOrder(dto, client, status, vehicle, driver, company);
        Order saved = orderRepository.save(order);
        return mapToDto(saved);
    }

    @Override
    public OrderDto updateOrder(Integer id, OrderDto dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        Status status = statusRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        Vehicle vehicle = dto.getAssignedVehicleId() != null ? vehicleRepository.findById(dto.getAssignedVehicleId()).orElse(null) : null;
        Employee driver = dto.getAssignedDriverId() != null ? employeeRepository.findById(dto.getAssignedDriverId()).orElse(null) : null;
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        updateOrderFromDto(order, dto, client, status, vehicle, driver, company);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    // --- Data Mapper Pattern Kullanımı ---
    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public OrderDto getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToDto(order);
    }

    @Override
    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id); // İleride soft-delete'e geçersen burada .setIsDeleted(true) kullanabilirsin
    }

    // --- Mapping Methods (Data Mapper) ---
    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getOrderId());
        dto.setClientId(order.getClient() != null ? order.getClient().getClientId() : null);
        dto.setOrderDate(order.getOrderDate());
        dto.setPickupAddress(order.getPickupAddress());
        dto.setDestinationAddress(order.getDestinationAddress());
        dto.setPickupDate(order.getPickupDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setStatusId(order.getStatus() != null ? order.getStatus().getStatusId() : null);
        dto.setAssignedVehicleId(order.getAssignedVehicle() != null ? order.getAssignedVehicle().getVehicleId() : null);
        dto.setAssignedDriverId(order.getAssignedDriver() != null ? order.getAssignedDriver().getEmployeeId() : null);
        dto.setCompanyId(order.getCompany() != null ? order.getCompany().getCompanyId() : null);
        return dto;
    }

    // --- Helper method for updates (Data Mapper) ---
    private void updateOrderFromDto(Order order, OrderDto dto, Client client, Status status, Vehicle vehicle, Employee driver, Company company) {
        order.setClient(client);
        order.setOrderDate(dto.getOrderDate());
        order.setPickupAddress(dto.getPickupAddress());
        order.setDestinationAddress(dto.getDestinationAddress());
        order.setPickupDate(dto.getPickupDate());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setStatus(status);
        order.setAssignedVehicle(vehicle);
        order.setAssignedDriver(driver);
        order.setCompany(company);
    }
}
