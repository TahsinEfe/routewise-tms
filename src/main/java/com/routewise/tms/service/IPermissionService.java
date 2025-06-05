package com.routewise.tms.service;

import com.routewise.tms.dto.PermissionDto;

import java.util.List;

public interface IPermissionService {
    PermissionDto createPermission(PermissionDto dto);
    PermissionDto updatePermission(Integer id, PermissionDto dto);
    void deletePermission(Integer id);
    PermissionDto getPermissionById(Integer id);
    List<PermissionDto> getAllPermissions();
}
