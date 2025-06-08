package com.routewise.tms.service;

import com.routewise.tms.dto.LocationDto;

import java.util.List;

public interface ILocationService {
    LocationDto createLocation(LocationDto dto);
    LocationDto updateLocation(Integer id, LocationDto dto);
    void deleteLocation(Integer id);
    LocationDto getLocationById(Integer id);
    List<LocationDto> getAllLocations();
}
