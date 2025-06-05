package com.routewise.tms.service;

import com.routewise.tms.dto.ExpensesCategoryDto;
import com.routewise.tms.model.ExpensesCategory;
import com.routewise.tms.repository.ExpensesCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpensesCategoryService {

    private final ExpensesCategoryRepository expensesCategoryRepository;

    public ExpensesCategoryDto addCategory(ExpensesCategoryDto dto) {
        ExpensesCategory category = ExpensesCategory.builder()
                .categoryName(dto.getCategoryName())
                .description(dto.getDescription())
                .build();
        category = expensesCategoryRepository.save(category);
        return toDto(category);
    }

    public void deleteCategory(Integer categoryId) {
        expensesCategoryRepository.deleteById(categoryId);
    }

    public List<ExpensesCategoryDto> getAll() {
        return expensesCategoryRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ExpensesCategoryDto toDto(ExpensesCategory category) {
        return ExpensesCategoryDto.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .build();
    }
}
