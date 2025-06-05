package com.routewise.tms.factory;


import com.routewise.tms.dto.OrderDto;
import com.routewise.tms.model.Client;
import com.routewise.tms.model.Status;
import com.routewise.tms.model.Vehicle;
import com.routewise.tms.model.Employee;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderFactory {
    // Factory Design Pattern: Nesne oluşturma mantığı burada merkezi şekilde sağlanır.
    public Order createOrder(OrderDto dto, Client client, Status status, Vehicle vehicle, Employee driver, Company company) {
        return Order.builder()
                .client(client)
                .orderDate(dto.getOrderDate())
                .pickupAddress(dto.getPickupAddress())
                .destinationAddress(dto.getDestinationAddress())
                .pickupDate(dto.getPickupDate())
                .deliveryDate(dto.getDeliveryDate())
                .status(status)
                .assignedVehicle(vehicle)
                .assignedDriver(driver)
                .company(company)
                .build();
    }
}
