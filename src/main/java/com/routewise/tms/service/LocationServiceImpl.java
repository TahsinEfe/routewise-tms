package com.routewise.tms.service;

import com.routewise.tms.dto.LocationDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.LocationFactory;
import com.routewise.tms.model.Location;
import com.routewise.tms.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements ILocationService {
    private final LocationRepository locationRepository;
    private final LocationFactory locationFactory;

    @Override
    public LocationDto createLocation(LocationDto dto) {
        Location location = locationFactory.createLocation(dto);
        Location saved = locationRepository.save(location);
        return locationFactory.mapToDto(saved);
    }

    @Override
    public LocationDto updateLocation(Integer id, LocationDto dto) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        location.setLocationName(dto.getLocationName());
        location.setAddress(dto.getAddress());
        Location updated = locationRepository.save(location);
        return locationFactory.mapToDto(updated);
    }

    @Override
    public void deleteLocation(Integer id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        locationRepository.delete(location); // Hard delete
    }

    @Override
    public LocationDto getLocationById(Integer id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        return locationFactory.mapToDto(location);
    }

    @Override
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(locationFactory::mapToDto)
                .toList();
    }
}
