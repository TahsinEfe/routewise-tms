package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingEventDto {
    private Integer eventId;
    private Integer orderId;
    private Integer statusId;
    private String description;
    private LocalDateTime eventTime;
    private LocalDateTime createdAt;
}
