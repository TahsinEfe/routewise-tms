package com.routewise.tms.repository;

import com.routewise.tms.dto.RoleDto;

import java.util.List;

public interface IRoleService {
    RoleDto createRole(RoleDto dto);
    RoleDto updateRole(Integer id, RoleDto dto);
    void deleteRole(Integer id);
    RoleDto getRoleById(Integer id);
    List<RoleDto> getAllRoles();
}
