package com.routewise.tms.service;

import com.routewise.tms.dto.VehicleTypeDto;
import java.util.List;

// Design Pattern: Service Layer, Data Mapper (DTO <-> Entity)
public interface IVehicleTypeService {
    VehicleTypeDto createVehicleType(VehicleTypeDto dto);
    VehicleTypeDto updateVehicleType(Integer id, VehicleTypeDto dto);
    void deleteVehicleType(Integer id);
    VehicleTypeDto getVehicleTypeById(Integer id);
    List<VehicleTypeDto> getAllVehicleTypes();
}
