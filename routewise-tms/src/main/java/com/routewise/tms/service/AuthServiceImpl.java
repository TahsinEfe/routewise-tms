package com.routewise.tms.service;

import com.routewise.tms.dto.*;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.UserEntity;
import com.routewise.tms.model.Role;
import com.routewise.tms.repository.CompanyRepository;
import com.routewise.tms.repository.RoleRepository;
import com.routewise.tms.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection (Spring otomatik yapar)
    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                           CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Object register(SignupRequest request) {
        // Input validation
        if (request.getCompanyId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company ID is required");
        }
        
        if (request.getRoleName() == null || request.getRoleName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role name is required");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // 1. Role ve Company bul with better error messages
        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Role '" + request.getRoleName() + "' not found. Available roles should be checked."
                ));
                
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Company with ID " + request.getCompanyId() + " not found. Please ensure the company exists."
                ));

        // 2. UserEntity oluştur
        UserEntity user = UserEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(role)
                .company(company)
                .isActive(true)
                .createdAt(new java.sql.Timestamp(System.currentTimeMillis()))
                .build();

        userRepository.save(user);

        return "User registration successful for company: " + company.getCompanyName();
    }

    @Override
    public Object login(SigninRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found or credentials invalid"));


        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }


        return new AuthResponse(
                "Login successful!",
                null, 
                new UserInfoDto(user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole().getRoleName())
        );
    }

    @Override
    public Object logout(String authHeader) {
        // Logout işlemi (opsiyonel)
        return "Çıkış başarılı!";
    }

    @Override
    public Object refreshToken(RefreshTokenRequest request) {
        // Token yenileme logic'i
        return "Token yenilendi!";
    }
}