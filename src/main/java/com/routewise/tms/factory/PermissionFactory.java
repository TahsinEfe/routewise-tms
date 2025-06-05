package com.routewise.tms.factory;

import com.routewise.tms.dto.PermissionDto;
import com.routewise.tms.model.Permission;
import org.springframework.stereotype.Component;

// GoF: Factory/Mapper Pattern
@Component
public class PermissionFactory {
    public Permission createPermission(PermissionDto dto) {
        return Permission.builder()
                .permissionName(dto.getPermissionName())
                .description(dto.getDescription())
                .build();
    }

    public PermissionDto mapToDto(Permission permission) {
        PermissionDto dto = new PermissionDto();
        dto.setPermissionId(permission.getPermissionId());
        dto.setPermissionName(permission.getPermissionName());
        dto.setDescription(permission.getDescription());
        return dto;
    }
}
