package com.routewise.tms.repository;

import com.routewise.tms.model.Company;
import com.routewise.tms.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByCompany(Company company);
    // Soft delete desteklenecekse ekle: List<Order> findAllByIsDeletedFalse();
}
