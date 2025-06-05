package com.routewise.tms.dto;

import lombok.Data;

@Data
public class StatusDto {
    private Integer statusId;
    private String statusName;
    private String description;
    private String category;
}
