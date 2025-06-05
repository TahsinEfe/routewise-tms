package com.routewise.tms.factory;

import com.routewise.tms.dto.RouteDto;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Location;
import com.routewise.tms.model.Route;
import org.springframework.stereotype.Component;

@Component
public class RouteFactory {
    public Route createRoute(RouteDto dto, Location start, Location end, Company company) {
        return Route.builder()
                .startLocation(start)
                .endLocation(end)
                .description(dto.getDescription())
                .company(company)
                .isDeleted(false)
                .build();
    }
}
