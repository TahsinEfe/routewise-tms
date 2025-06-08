package com.routewise.tms.service;

import com.routewise.tms.dto.VehicleDto;
import java.util.List;

// Design Pattern: Service Layer, Data Mapper, Factory
public interface IVehicleService {
    VehicleDto createVehicle(VehicleDto dto);
    VehicleDto updateVehicle(Integer id, VehicleDto dto);
    void deleteVehicle(Integer id);
    VehicleDto getVehicleById(Integer id);
    List<VehicleDto> getAllVehicles();
}
