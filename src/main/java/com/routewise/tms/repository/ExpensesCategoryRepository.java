package com.routewise.tms.repository;

import com.routewise.tms.model.ExpensesCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpensesCategoryRepository extends JpaRepository<ExpensesCategory, Integer> {
    boolean existsByCategoryName(String categoryName);
}
