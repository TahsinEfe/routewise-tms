package com.routewise.tms.service;

import com.routewise.tms.dto.RoleDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.RoleFactory;
import com.routewise.tms.model.Role;
import com.routewise.tms.repository.IRoleService;
import com.routewise.tms.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Design Pattern: Service + Factory/Mapper (GoF)
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements IRoleService {

    private final RoleRepository roleRepository;
    private final RoleFactory roleFactory;

    @Override
    public RoleDto createRole(RoleDto dto) {
        Role role = roleFactory.createRole(dto);
        Role saved = roleRepository.save(role);
        return roleFactory.mapToDto(saved);
    }

    @Override
    public RoleDto updateRole(Integer id, RoleDto dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());
        Role updated = roleRepository.save(role);
        return roleFactory.mapToDto(updated);
    }

    @Override
    public void deleteRole(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        roleRepository.delete(role);
    }

    @Override
    public RoleDto getRoleById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return roleFactory.mapToDto(role);
    }

    @Override
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleFactory::mapToDto)
                .toList();
    }
}
