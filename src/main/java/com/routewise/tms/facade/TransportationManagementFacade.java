package com.routewise.tms.facade;

import com.routewise.tms.dto.CompanyDto;
import com.routewise.tms.service.ICompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

//Facade Method
@Component
@RequiredArgsConstructor
public class TransportationManagementFacade {
    private final ICompanyService companyService;

    public CompanyDto createCompany(CompanyDto dto) {
        return companyService.createCompany(dto);
    }
    public List<CompanyDto> getAllCompanies() {
        return companyService.getAllCompanies();
    }
    public CompanyDto getCompanyById(Integer id) {
        return companyService.getCompanyById(id);
    }
    public CompanyDto updateCompany(Integer id, CompanyDto dto) {
        return companyService.updateCompany(id, dto);
    }
    public void deleteCompany(Integer id) {
        companyService.deleteCompany(id);
    }
}