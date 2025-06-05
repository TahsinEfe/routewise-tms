package com.routewise.tms.service;

import com.routewise.tms.dto.RouteDto;

import java.util.List;

public interface IRouteService {
    RouteDto createRoute(RouteDto dto);
    RouteDto updateRoute(Integer id, RouteDto dto);
    void deleteRoute(Integer id);
    RouteDto getRouteById(Integer id);
    List<RouteDto> getAllRoutes();
}
