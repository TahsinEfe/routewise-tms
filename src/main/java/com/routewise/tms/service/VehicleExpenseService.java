package com.routewise.tms.service;

import com.routewise.tms.dto.VehicleExpenseDto;
import com.routewise.tms.model.VehicleExpense;
import com.routewise.tms.repository.VehicleExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleExpenseService {

    private final VehicleExpenseRepository vehicleExpenseRepository;

    public VehicleExpenseDto addVehicleExpense(VehicleExpenseDto dto) {
        VehicleExpense expense = VehicleExpense.builder()
                .vehicleId(dto.getVehicleId())
                .expenseDate(dto.getExpenseDate())
                .categoryId(dto.getCategoryId())
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .companyId(dto.getCompanyId())
                .build();
        expense = vehicleExpenseRepository.save(expense);
        return toDto(expense);
    }

    public void deleteVehicleExpense(Integer expenseId) {
        vehicleExpenseRepository.deleteById(expenseId);
    }

    public List<VehicleExpenseDto> getAll() {
        return vehicleExpenseRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<VehicleExpenseDto> getByVehicleId(Integer vehicleId) {
        return vehicleExpenseRepository.findByVehicleId(vehicleId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<VehicleExpenseDto> getByCompanyId(Integer companyId) {
        return vehicleExpenseRepository.findByCompanyId(companyId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<VehicleExpenseDto> getByCategoryId(Integer categoryId) {
        return vehicleExpenseRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public VehicleExpenseDto toDto(VehicleExpense expense) {
        return VehicleExpenseDto.builder()
                .expenseId(expense.getExpenseId())
                .vehicleId(expense.getVehicleId())
                .expenseDate(expense.getExpenseDate())
                .categoryId(expense.getCategoryId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .companyId(expense.getCompanyId())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
