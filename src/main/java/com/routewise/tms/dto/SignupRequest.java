package com.routewise.tms.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private String roleName;
    private Integer companyId;
}
