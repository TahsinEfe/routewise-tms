package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import com.routewise.tms.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<UserEntity> findAllByCompanyAndIsDeletedFalse(Company company);
}
