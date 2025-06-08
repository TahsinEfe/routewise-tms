package com.routewise.tms.service;

import com.routewise.tms.dto.RefreshTokenRequest;
import com.routewise.tms.dto.SigninRequest;
import com.routewise.tms.dto.SignupRequest;

public interface AuthService {
    Object register(SignupRequest request);
    Object login(SigninRequest request);
    Object logout(String authHeader);
    Object refreshToken(RefreshTokenRequest request);
}
