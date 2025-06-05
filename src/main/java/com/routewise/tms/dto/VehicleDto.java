package com.routewise.tms.dto;

import lombok.Data;

@Data
public class VehicleDto {
    private Integer vehicleId;
    private String licensePlate;
    private Integer vehicleTypeId;
    private Integer assignedDriverId;
    private Integer companyId;
}
