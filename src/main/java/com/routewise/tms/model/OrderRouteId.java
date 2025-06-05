package com.routewise.tms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRouteId implements Serializable {
    private Integer orderId;
    private Integer routeId;
}
