package com.routewise.tms.service;

import com.routewise.tms.dto.CompanyDto;
import java.util.List;

//Strategy
public interface ICompanyService {
    CompanyDto createCompany(CompanyDto dto);
    List<CompanyDto> getAllCompanies();
    CompanyDto getCompanyById(Integer id);
    CompanyDto updateCompany(Integer id, CompanyDto dto);
    void deleteCompany(Integer id);
}
