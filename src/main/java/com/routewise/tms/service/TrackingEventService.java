package com.routewise.tms.service;

import com.routewise.tms.dto.TrackingEventDto;
import com.routewise.tms.model.TrackingEvent;
import com.routewise.tms.repository.TrackingEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackingEventService {

    private final TrackingEventRepository trackingEventRepository;

    public TrackingEventDto addTrackingEvent(TrackingEventDto dto) {
        TrackingEvent event = TrackingEvent.builder()
                .orderId(dto.getOrderId())
                .statusId(dto.getStatusId())
                .description(dto.getDescription())
                .eventTime(dto.getEventTime())
                .build();
        event = trackingEventRepository.save(event);
        return toDto(event);
    }

    public void deleteTrackingEvent(Integer eventId) {
        trackingEventRepository.deleteById(eventId);
    }

    public List<TrackingEventDto> getByOrderId(Integer orderId) {
        return trackingEventRepository.findByOrderId(orderId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TrackingEventDto> getByStatusId(Integer statusId) {
        return trackingEventRepository.findByStatusId(statusId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TrackingEventDto> getAll() {
        return trackingEventRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TrackingEventDto toDto(TrackingEvent event) {
        return TrackingEventDto.builder()
                .eventId(event.getEventId())
                .orderId(event.getOrderId())
                .statusId(event.getStatusId())
                .description(event.getDescription())
                .eventTime(event.getEventTime())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
