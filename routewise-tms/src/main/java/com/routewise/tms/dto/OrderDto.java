package com.routewise.tms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OrderDto {
    private Integer orderId;
    private Integer clientId;
    private LocalDate orderDate;
    private String pickupAddress;
    private String destinationAddress;
    private LocalDate pickupDate;
    private LocalDate deliveryDate;
    private Integer statusId;
    private Integer assignedVehicleId;
    private Integer assignedDriverId;
    private Integer companyId;
}
