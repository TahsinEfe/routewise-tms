package com.routewise.tms.factory;

import com.routewise.tms.dto.FuelTypeDto;
import com.routewise.tms.model.FuelType;
import org.springframework.stereotype.Component;

// DESIGN PATTERN: Factory/Mapper (GoF)
@Component
public class FuelTypeFactory {
    public FuelType createFuelType(FuelTypeDto dto) {
        return FuelType.builder()
                .fuelTypeName(dto.getFuelTypeName())
                .description(dto.getDescription())
                .build();
    }

    public FuelTypeDto mapToDto(FuelType fuelType) {
        FuelTypeDto dto = new FuelTypeDto();
        dto.setFuelTypeId(fuelType.getFuelTypeId());
        dto.setFuelTypeName(fuelType.getFuelTypeName());
        dto.setDescription(fuelType.getDescription());
        return dto;
    }
}
