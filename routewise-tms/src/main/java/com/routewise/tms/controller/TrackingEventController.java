package com.routewise.tms.controller;

import com.routewise.tms.dto.TrackingEventDto;
import com.routewise.tms.service.TrackingEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking-events")
@RequiredArgsConstructor
public class TrackingEventController {

    private final TrackingEventService trackingEventService;

    @PostMapping
    public ResponseEntity<TrackingEventDto> addTrackingEvent(@RequestBody TrackingEventDto dto) {
        return ResponseEntity.ok(trackingEventService.addTrackingEvent(dto));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteTrackingEvent(@PathVariable Integer eventId) {
        trackingEventService.deleteTrackingEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TrackingEventDto>> getAllTrackingEvents() {
        return ResponseEntity.ok(trackingEventService.getAll());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<TrackingEventDto>> getByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(trackingEventService.getByOrderId(orderId));
    }

    @GetMapping("/status/{statusId}")
    public ResponseEntity<List<TrackingEventDto>> getByStatusId(@PathVariable Integer statusId) {
        return ResponseEntity.ok(trackingEventService.getByStatusId(statusId));
    }
}