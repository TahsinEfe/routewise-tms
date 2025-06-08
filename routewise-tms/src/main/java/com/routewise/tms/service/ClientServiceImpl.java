package com.routewise.tms.service;

import com.routewise.tms.dto.ClientDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.ClientFactory;
import com.routewise.tms.model.Client;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.UserEntity;
import com.routewise.tms.model.Employee;
import com.routewise.tms.repository.ClientRepository;
import com.routewise.tms.repository.CompanyRepository;
import com.routewise.tms.repository.UserRepository;
import com.routewise.tms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements IClientService {

    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ClientFactory clientFactory;

    @Override
    public ClientDto createClient(ClientDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Employee employee = dto.getAccountManagerId() != null
                ? employeeRepository.findById(dto.getAccountManagerId()).orElse(null)
                : null;

        Client client = clientFactory.createClient(dto, company, user, employee);
        Client saved = clientRepository.save(client);
        return mapToDto(saved);
    }

    @Override
    public ClientDto updateClient(Integer id, ClientDto dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Employee employee = dto.getAccountManagerId() != null
                ? employeeRepository.findById(dto.getAccountManagerId()).orElse(null)
                : null;
        updateClientFromDto(client, dto, company, user, employee);
        Client updated = clientRepository.save(client);
        return mapToDto(updated);
    }

    @Override
    public List<ClientDto> getAllClients() {
        return clientRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public ClientDto getClientById(Integer id) {
        Client client = clientRepository.findById(id)
                .filter(c -> !Boolean.TRUE.equals(c.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        return mapToDto(client);
    }

    @Override
    public void deleteClient(Integer clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        client.setIsDeleted(true);
        clientRepository.save(client);
    }

    // --- Mapping Methods ---
    private ClientDto mapToDto(Client client) {
        ClientDto dto = new ClientDto();
        dto.setClientId(client.getClientId());
        dto.setCompanyName(client.getCompanyName());
        dto.setContactName(client.getContactName());
        dto.setPhone(client.getPhone());
        dto.setEmail(client.getEmail());
        dto.setBillingAddress(client.getBillingAddress());
        dto.setShippingAddress(client.getShippingAddress());
        dto.setCompanyId(client.getCompany() != null ? client.getCompany().getCompanyId() : null);
        dto.setUserId(client.getUser() != null ? client.getUser().getUserId() : null);
        dto.setAccountManagerId(
                client.getAccountManager() != null ? client.getAccountManager().getEmployeeId() : null
        );
        return dto;
    }

    private void updateClientFromDto(Client client, ClientDto dto, Company company, UserEntity user, Employee employee) {
        client.setCompanyName(dto.getCompanyName());
        client.setContactName(dto.getContactName());
        client.setPhone(dto.getPhone());
        client.setEmail(dto.getEmail());
        client.setBillingAddress(dto.getBillingAddress());
        client.setShippingAddress(dto.getShippingAddress());
        client.setCompany(company);
        client.setUser(user);
        client.setAccountManager(employee);
        // isDeleted ve createdAt güncellenmez!
    }
}
