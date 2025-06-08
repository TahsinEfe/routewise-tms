package com.routewise.tms.service;

import com.routewise.tms.dto.CompanyDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.CompanyFactory;
import com.routewise.tms.model.Client;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.UserEntity;
import com.routewise.tms.repository.ClientRepository;
import com.routewise.tms.repository.CompanyRepository;
import com.routewise.tms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements ICompanyService{
    private final CompanyRepository companyRepository;
    private final CompanyFactory companyFactory;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

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
    public void deleteCompany(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        // 1. Bağlı Clients soft-delete (örnek)
        List<Client> clients = clientRepository.findAllByCompanyAndIsDeletedFalse(company);
        for (Client client : clients) {
            client.setIsDeleted(true);
            clientRepository.save(client);
        }

        // 2. Bağlı Users soft-delete (örnek)
        List<UserEntity> users = userRepository.findAllByCompanyAndIsDeletedFalse(company);
        for (UserEntity user : users) {
            user.setIsDeleted(true);
            userRepository.save(user);
        }

        // 3. Company soft-delete
        company.setIsDeleted(true);
        companyRepository.save(company);
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