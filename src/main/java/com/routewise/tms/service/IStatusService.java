package com.routewise.tms.service;

import com.routewise.tms.dto.StatusDto;

import java.util.List;

// Design Pattern: Service Layer, Data Mapper (Status <-> StatusDto)
public interface IStatusService {
    StatusDto createStatus(StatusDto dto);
    StatusDto updateStatus(Integer id, StatusDto dto);
    void deleteStatus(Integer id);
    StatusDto getStatusById(Integer id);
    List<StatusDto> getAllStatuses();
}
