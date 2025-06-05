package com.routewise.tms.dto;

import lombok.Data;

@Data
public class RouteDto {
    private Integer routeId;
    private Integer startLocationId;
    private Integer endLocationId;
    private String description;
    private Integer companyId;
}
