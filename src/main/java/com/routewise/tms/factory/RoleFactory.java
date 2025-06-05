package com.routewise.tms.factory;

import com.routewise.tms.dto.RoleDto;
import com.routewise.tms.model.Role;
import org.springframework.stereotype.Component;

// Design Pattern: Factory/Mapper (GoF)
@Component
public class RoleFactory {
    public Role createRole(RoleDto dto) {
        return Role.builder()
                .roleName(dto.getRoleName())
                .description(dto.getDescription())
                .build();
    }

    public RoleDto mapToDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setRoleId(role.getRoleId());
        dto.setRoleName(role.getRoleName());
        dto.setDescription(role.getDescription());
        return dto;
    }
}
