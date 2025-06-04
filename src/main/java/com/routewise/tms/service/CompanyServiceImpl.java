package com.routewise.tms.service;

import com.routewise.tms.dto.CompanyDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.CompanyFactory;
import com.routewise.tms.model.Company;
import com.routewise.tms.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements ICompanyService{
    private final CompanyRepository companyRepository;
    private final CompanyFactory companyFactory;

    @Override
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = companyFactory.createCompany(dto);
        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyDto getCompanyById(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return mapToDto(company);
    }

    @Override
    public CompanyDto updateCompany(Integer id, CompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        company.setCompanyName(dto.getCompanyName());
        company.setCompanyAddress(dto.getCompanyAddress());
        company.setCompanyPhone(dto.getCompanyPhone());
        company.setCompanyEmail(dto.getCompanyEmail());
        company.setCompanyWebsite(dto.getCompanyWebsite());
        company.setContactPerson(dto.getContactPerson());
        Company updated = companyRepository.save(company);
        return mapToDto(updated);
    }

    @Override
    public void deleteCompany(Integer id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found");
        }
        companyRepository.deleteById(id);
    }

    // Mapping metodu
    private CompanyDto mapToDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setCompanyId(company.getCompanyId());
        dto.setCompanyName(company.getCompanyName());
        dto.setCompanyAddress(company.getCompanyAddress());
        dto.setCompanyPhone(company.getCompanyPhone());
        dto.setCompanyEmail(company.getCompanyEmail());
        dto.setCompanyWebsite(company.getCompanyWebsite());
        dto.setContactPerson(company.getContactPerson());
        return dto;
    }
}