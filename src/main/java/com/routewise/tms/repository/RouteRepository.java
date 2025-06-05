package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import com.routewise.tms.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    List<Route> findAllByIsDeletedFalse();
    List<Route> findAllByCompanyAndIsDeletedFalse(Company company);
}
