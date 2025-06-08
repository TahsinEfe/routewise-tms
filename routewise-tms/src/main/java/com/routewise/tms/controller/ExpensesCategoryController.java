package com.routewise.tms.controller;

import com.routewise.tms.dto.ExpensesCategoryDto;
import com.routewise.tms.service.ExpensesCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses-categories")
@RequiredArgsConstructor
public class ExpensesCategoryController {

    private final ExpensesCategoryService expensesCategoryService;

    @PostMapping
    public ResponseEntity<ExpensesCategoryDto> addCategory(@RequestBody ExpensesCategoryDto dto) {
        return ResponseEntity.ok(expensesCategoryService.addCategory(dto));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer categoryId) {
        expensesCategoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpensesCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(expensesCategoryService.getAll());
    }
}