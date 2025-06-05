package com.routewise.tms.factory;

import com.routewise.tms.dto.ClientDto;
import com.routewise.tms.model.Client;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Employee;
import com.routewise.tms.model.UserEntity;
import org.springframework.stereotype.Component;

// [Design Pattern: Factory]
// Açıklama: Client entity'sinin oluşturulmasını merkezi bir noktada yönetir.
// Kodun geri kalanını karmaşıklıktan korur, reusable ve test edilebilir yapar.
@Component
public class ClientFactory {
    public Client createClient(ClientDto dto, Company company, UserEntity user, Employee employee) {
        return Client.builder()
                .companyName(dto.getCompanyName())
                .contactName(dto.getContactName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .billingAddress(dto.getBillingAddress())
                .shippingAddress(dto.getShippingAddress())
                .company(company)
                .user(user)
                .accountManager(employee)
                .isDeleted(false)
                .build();
    }
}
