package com.routewise.tms.service;

import com.routewise.tms.dto.PermissionDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.PermissionFactory;
import com.routewise.tms.model.Permission;
import com.routewise.tms.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// GoF: Service + Factory/Mapper Pattern
@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements IPermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionFactory permissionFactory;

    @Override
    public PermissionDto createPermission(PermissionDto dto) {
        Permission permission = permissionFactory.createPermission(dto);
        Permission saved = permissionRepository.save(permission);
        return permissionFactory.mapToDto(saved);
    }

    @Override
    public PermissionDto updatePermission(Integer id, PermissionDto dto) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
        permission.setPermissionName(dto.getPermissionName());
        permission.setDescription(dto.getDescription());
        Permission updated = permissionRepository.save(permission);
        return permissionFactory.mapToDto(updated);
    }

    @Override
    public void deletePermission(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
        permissionRepository.delete(permission);
    }

    @Override
    public PermissionDto getPermissionById(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
        return permissionFactory.mapToDto(permission);
    }

    @Override
    public List<PermissionDto> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionFactory::mapToDto)
                .toList();
    }
}
