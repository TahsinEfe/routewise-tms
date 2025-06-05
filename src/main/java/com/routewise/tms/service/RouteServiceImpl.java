package com.routewise.tms.service;

import com.routewise.tms.dto.RouteDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.RouteFactory;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Location;
import com.routewise.tms.model.Route;
import com.routewise.tms.repository.CompanyRepository;
import com.routewise.tms.repository.LocationRepository;
import com.routewise.tms.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// GoF: Service Layer (Facade), Data Mapper Pattern
@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements IRouteService {
    private final RouteRepository routeRepository;
    private final LocationRepository locationRepository;
    private final CompanyRepository companyRepository;
    private final RouteFactory routeFactory;

    @Override
    public RouteDto createRoute(RouteDto dto) {
        Location start = locationRepository.findById(dto.getStartLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Start location not found"));
        Location end = locationRepository.findById(dto.getEndLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("End location not found"));
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        Route route = routeFactory.createRoute(dto, start, end, company);
        Route saved = routeRepository.save(route);
        return mapToDto(saved);
    }

    @Override
    public RouteDto updateRoute(Integer id, RouteDto dto) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        Location start = locationRepository.findById(dto.getStartLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Start location not found"));
        Location end = locationRepository.findById(dto.getEndLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("End location not found"));
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        updateRouteFromDto(route, dto, start, end, company);
        Route updated = routeRepository.save(route);
        return mapToDto(updated);
    }

    @Override
    public void deleteRoute(Integer id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        route.setIsDeleted(true);
        routeRepository.save(route);
    }

    @Override
    public RouteDto getRouteById(Integer id) {
        Route route = routeRepository.findById(id)
                .filter(r -> !Boolean.TRUE.equals(r.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        return mapToDto(route);
    }

    @Override
    public List<RouteDto> getAllRoutes() {
        return routeRepository.findAllByIsDeletedFalse()
                .stream().map(this::mapToDto).toList();
    }

    // --- Mapping ---
    private RouteDto mapToDto(Route route) {
        RouteDto dto = new RouteDto();
        dto.setRouteId(route.getRouteId());
        dto.setStartLocationId(route.getStartLocation() != null ? route.getStartLocation().getLocationId() : null);
        dto.setEndLocationId(route.getEndLocation() != null ? route.getEndLocation().getLocationId() : null);
        dto.setDescription(route.getDescription());
        dto.setCompanyId(route.getCompany() != null ? route.getCompany().getCompanyId() : null);
        return dto;
    }

    private void updateRouteFromDto(Route route, RouteDto dto, Location start, Location end, Company company) {
        route.setStartLocation(start);
        route.setEndLocation(end);
        route.setDescription(dto.getDescription());
        route.setCompany(company);
        // isDeleted ve createdAt güncellenmez
    }
}
