package com.routewise.tms.service;

import com.routewise.tms.dto.PayrollDto;
import com.routewise.tms.model.Payroll;
import com.routewise.tms.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;

    public PayrollDto addPayroll(PayrollDto dto) {
        Payroll payroll = Payroll.builder()
                .employeeId(dto.getEmployeeId())
                .paymentDate(dto.getPaymentDate())
                .totalEarnings(dto.getTotalEarnings())
                .totalDeductions(dto.getTotalDeductions())
                .netSalary(dto.getNetSalary())
                .companyId(dto.getCompanyId())
                .build();
        payroll = payrollRepository.save(payroll);
        return toDto(payroll);
    }

    public void deletePayroll(Integer payrollId) {
        payrollRepository.deleteById(payrollId);
    }

    public List<PayrollDto> getAll() {
        return payrollRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PayrollDto> getByEmployeeId(Integer employeeId) {
        return payrollRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PayrollDto> getByCompanyId(Integer companyId) {
        return payrollRepository.findByCompanyId(companyId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PayrollDto toDto(Payroll p) {
        return PayrollDto.builder()
                .payrollId(p.getPayrollId())
                .employeeId(p.getEmployeeId())
                .paymentDate(p.getPaymentDate())
                .totalEarnings(p.getTotalEarnings())
                .totalDeductions(p.getTotalDeductions())
                .netSalary(p.getNetSalary())
                .companyId(p.getCompanyId())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
