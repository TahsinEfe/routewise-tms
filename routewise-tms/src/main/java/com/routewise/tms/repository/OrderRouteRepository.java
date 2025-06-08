package com.routewise.tms.repository;

import com.routewise.tms.model.OrderRoute;
import com.routewise.tms.model.OrderRouteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRouteRepository extends JpaRepository<OrderRoute, OrderRouteId> {
}
