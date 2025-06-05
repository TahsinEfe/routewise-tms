package com.routewise.tms.factory;

import com.routewise.tms.dto.VehicleTypeDto;
import com.routewise.tms.model.VehicleType;
import org.springframework.stereotype.Component;

// Design Pattern: Factory
@Component
public class VehicleTypeFactory {
    public VehicleType createVehicleType(VehicleTypeDto dto) {
        return VehicleType.builder()
                .vehicleTypeName(dto.getVehicleTypeName())
                .description(dto.getDescription())
                .build();
    }
}
