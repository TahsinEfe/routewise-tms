package com.routewise.tms.service;

import com.routewise.tms.dto.FuelTypeDto;

import java.util.List;

public interface IFuelTypeService {
    FuelTypeDto createFuelType(FuelTypeDto dto);
    FuelTypeDto updateFuelType(Integer id, FuelTypeDto dto);
    void deleteFuelType(Integer id);
    FuelTypeDto getFuelTypeById(Integer id);
    List<FuelTypeDto> getAllFuelTypes();
}
