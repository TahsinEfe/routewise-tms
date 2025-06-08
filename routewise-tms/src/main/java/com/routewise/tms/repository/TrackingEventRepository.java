package com.routewise.tms.repository;

import com.routewise.tms.model.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Integer> {
    List<TrackingEvent> findByOrderId(Integer orderId);
    List<TrackingEvent> findByStatusId(Integer statusId);
}
