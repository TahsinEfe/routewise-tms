package com.routewise.tms.service;

import com.routewise.tms.dto.StatusDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.StatusFactory;
import com.routewise.tms.model.Status;
import com.routewise.tms.repository.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusServiceImpl implements IStatusService {
    private final StatusRepository statusRepository;
    private final StatusFactory statusFactory;

    @Override
    public StatusDto createStatus(StatusDto dto) {
        Status status = statusFactory.createStatus(dto);
        Status saved = statusRepository.save(status);
        return mapToDto(saved);
    }

    @Override
    public StatusDto updateStatus(Integer id, StatusDto dto) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        status.setStatusName(dto.getStatusName());
        status.setDescription(dto.getDescription());
        status.setCategory(dto.getCategory());
        return mapToDto(statusRepository.save(status));
    }

    @Override
    public void deleteStatus(Integer id) {
        statusRepository.deleteById(id);
    }

    @Override
    public StatusDto getStatusById(Integer id) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        return mapToDto(status);
    }

    @Override
    public List<StatusDto> getAllStatuses() {
        return statusRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    // Data Mapper Pattern
    private StatusDto mapToDto(Status entity) {
        StatusDto dto = new StatusDto();
        dto.setStatusId(entity.getStatusId());
        dto.setStatusName(entity.getStatusName());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        return dto;
    }
}
