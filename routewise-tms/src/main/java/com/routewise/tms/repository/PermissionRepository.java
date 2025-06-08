package com.routewise.tms.repository;

import com.routewise.tms.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// GoF: DAO/Repository Pattern
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Optional<Permission> findByPermissionName(String name);
    boolean existsByPermissionName(String name);
}
