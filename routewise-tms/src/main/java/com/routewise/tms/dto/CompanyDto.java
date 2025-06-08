package com.routewise.tms.dto;

import lombok.Data;

@Data
public class CompanyDto {
    private Integer companyId;
    private String companyName;
    private String companyAddress;
    private String companyPhone;
    private String companyEmail;
    private String companyWebsite;
    private String contactPerson;
}
