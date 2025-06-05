package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "order_routes")
@IdClass(OrderRouteId.class) // (Composite Key Pattern)
public class OrderRoute {
    @Id
    @Column(name = "order_id")
    private Integer orderId;

    @Id
    @Column(name = "route_id")
    private Integer routeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", insertable = false, updatable = false)
    private Route route;
}
