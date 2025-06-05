package com.routewise.tms.service;

import com.routewise.tms.dto.FuelTypeDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.FuelTypeFactory;
import com.routewise.tms.model.FuelType;
import com.routewise.tms.repository.FuelTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuelTypeServiceImpl implements IFuelTypeService {

    private final FuelTypeRepository fuelTypeRepository;
    private final FuelTypeFactory fuelTypeFactory;

    @Override
    public FuelTypeDto createFuelType(FuelTypeDto dto) {
        FuelType fuelType = fuelTypeFactory.createFuelType(dto);
        FuelType saved = fuelTypeRepository.save(fuelType);
        return fuelTypeFactory.mapToDto(saved);
    }

    @Override
    public FuelTypeDto updateFuelType(Integer id, FuelTypeDto dto) {
        FuelType fuelType = fuelTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelType not found"));
        fuelType.setFuelTypeName(dto.getFuelTypeName());
        fuelType.setDescription(dto.getDescription());
        FuelType updated = fuelTypeRepository.save(fuelType);
        return fuelTypeFactory.mapToDto(updated);
    }

    @Override
    public void deleteFuelType(Integer id) {
        FuelType fuelType = fuelTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelType not found"));
        fuelTypeRepository.delete(fuelType);
    }

    @Override
    public FuelTypeDto getFuelTypeById(Integer id) {
        FuelType fuelType = fuelTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelType not found"));
        return fuelTypeFactory.mapToDto(fuelType);
    }

    @Override
    public List<FuelTypeDto> getAllFuelTypes() {
        return fuelTypeRepository.findAll().stream()
                .map(fuelTypeFactory::mapToDto)
                .toList();
    }
}
