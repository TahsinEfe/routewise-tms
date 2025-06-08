package com.routewise.tms.factory;

import com.routewise.tms.dto.StatusDto;
import com.routewise.tms.model.Status;
import org.springframework.stereotype.Component;

// Design Pattern: Factory - Status nesnesi yaratımı burada soyutlanır.
@Component
public class StatusFactory {
    public Status createStatus(StatusDto dto) {
        return Status.builder()
                .statusName(dto.getStatusName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .build();
    }
}
