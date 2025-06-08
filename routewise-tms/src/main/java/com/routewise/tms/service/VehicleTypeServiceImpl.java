package com.routewise.tms.service;

import com.routewise.tms.dto.VehicleTypeDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.VehicleTypeFactory;
import com.routewise.tms.model.VehicleType;
import com.routewise.tms.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleTypeServiceImpl implements IVehicleTypeService {
    private final VehicleTypeRepository vehicleTypeRepository;
    private final VehicleTypeFactory vehicleTypeFactory;

    @Override
    public VehicleTypeDto createVehicleType(VehicleTypeDto dto) {
        VehicleType vt = vehicleTypeFactory.createVehicleType(dto);
        return mapToDto(vehicleTypeRepository.save(vt));
    }

    @Override
    public VehicleTypeDto updateVehicleType(Integer id, VehicleTypeDto dto) {
        VehicleType vt = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleType not found"));
        vt.setVehicleTypeName(dto.getVehicleTypeName());
        vt.setDescription(dto.getDescription());
        return mapToDto(vehicleTypeRepository.save(vt));
    }

    @Override
    public void deleteVehicleType(Integer id) {
        vehicleTypeRepository.deleteById(id);
    }

    @Override
    public VehicleTypeDto getVehicleTypeById(Integer id) {
        return vehicleTypeRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleType not found"));
    }

    @Override
    public List<VehicleTypeDto> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    private VehicleTypeDto mapToDto(VehicleType entity) {
        VehicleTypeDto dto = new VehicleTypeDto();
        dto.setVehicleTypeId(entity.getVehicleTypeId());
        dto.setVehicleTypeName(entity.getVehicleTypeName());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}