package com.routewise.tms.repository;

import com.routewise.tms.model.Client;
import com.routewise.tms.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    List<Client> findAllByCompanyAndIsDeletedFalse(Company company);
    List<Client> findAllByIsDeletedFalse();
}
