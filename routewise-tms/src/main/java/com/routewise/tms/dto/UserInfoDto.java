package com.routewise.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoDto {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String roleName;
}
