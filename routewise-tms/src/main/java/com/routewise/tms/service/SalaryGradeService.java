package com.routewise.tms.service;

import com.routewise.tms.dto.SalaryGradeDto;
import com.routewise.tms.model.SalaryGrade;
import com.routewise.tms.repository.SalaryGradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryGradeService {

    private final SalaryGradeRepository salaryGradeRepository;

    public SalaryGradeDto addSalaryGrade(SalaryGradeDto dto) {
        if (salaryGradeRepository.existsByGradeName(dto.getGradeName())) {
            throw new IllegalArgumentException("This grade name already exists!");
        }
        SalaryGrade grade = SalaryGrade.builder()
                .gradeName(dto.getGradeName())
                .minSalary(dto.getMinSalary())
                .maxSalary(dto.getMaxSalary())
                .description(dto.getDescription())
                .build();
        grade = salaryGradeRepository.save(grade);
        return toDto(grade);
    }

    public void deleteSalaryGrade(Integer gradeId) {
        salaryGradeRepository.deleteById(gradeId);
    }

    public List<SalaryGradeDto> getAll() {
        return salaryGradeRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SalaryGradeDto toDto(SalaryGrade grade) {
        return SalaryGradeDto.builder()
                .gradeId(grade.getGradeId())
                .gradeName(grade.getGradeName())
                .minSalary(grade.getMinSalary())
                .maxSalary(grade.getMaxSalary())
                .description(grade.getDescription())
                .build();
    }
}
