package com.routewise.tms.factory;

import com.routewise.tms.dto.CompanyDto;
import com.routewise.tms.model.Company;
import org.springframework.stereotype.Component;

@Component
public class CompanyFactory {
    public Company createCompany(CompanyDto dto) {
        return Company.builder()
                .companyName(dto.getCompanyName())
                .companyAddress(dto.getCompanyAddress())
                .companyPhone(dto.getCompanyPhone())
                .companyEmail(dto.getCompanyEmail())
                .companyWebsite(dto.getCompanyWebsite())
                .contactPerson(dto.getContactPerson())
                .build();
    }
}