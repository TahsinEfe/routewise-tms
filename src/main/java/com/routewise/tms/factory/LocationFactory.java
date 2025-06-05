package com.routewise.tms.factory;

import com.routewise.tms.dto.LocationDto;
import com.routewise.tms.model.Location;
import org.springframework.stereotype.Component;

// DESIGN PATTERN: Factory / Mapper
@Component
public class LocationFactory {
    public Location createLocation(LocationDto dto) {
        return Location.builder()
                .locationName(dto.getLocationName())
                .address(dto.getAddress())
                .build();
    }

    public LocationDto mapToDto(Location location) {
        LocationDto dto = new LocationDto();
        dto.setLocationId(location.getLocationId());
        dto.setLocationName(location.getLocationName());
        dto.setAddress(location.getAddress());
        dto.setCreatedAt(location.getCreatedAt() != null ? location.getCreatedAt().toString() : null);
        return dto;
    }
}
