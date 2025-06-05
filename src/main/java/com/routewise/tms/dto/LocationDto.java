package com.routewise.tms.dto;

import lombok.Data;

@Data
public class LocationDto {
    private Integer locationId;
    private String locationName;
    private String address;
    private String createdAt;
}
