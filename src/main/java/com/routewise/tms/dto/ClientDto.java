package com.routewise.tms.dto;

import lombok.Data;

@Data
public class ClientDto {
    private Integer clientId;
    private String companyName;
    private String contactName;
    private String phone;
    private String email;
    private String billingAddress;
    private String shippingAddress;
    private Integer accountManagerId;
    private Integer userId;
    private Integer companyId;
}
