package com.routewise.tms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.routewise.tms.model.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);
}
