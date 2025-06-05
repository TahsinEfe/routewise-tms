package com.routewise.tms.factory;

import com.routewise.tms.dto.VehicleDto;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Employee;
import com.routewise.tms.model.Vehicle;
import com.routewise.tms.model.VehicleType;
import org.springframework.stereotype.Component;

@Component
public class VehicleFactory {
    // Factory Pattern Kullanımı
    public Vehicle createVehicle(VehicleDto dto, VehicleType vehicleType, Employee assignedDriver, Company company) {
        return Vehicle.builder()
                .licensePlate(dto.getLicensePlate())
                .vehicleType(vehicleType)
                .assignedDriver(assignedDriver)
                .company(company)
                .isDeleted(false)
                .build();
    }
}
