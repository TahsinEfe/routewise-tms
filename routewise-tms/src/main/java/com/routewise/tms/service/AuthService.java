package com.routewise.tms.service;

import com.routewise.tms.dto.RefreshTokenRequest;
import com.routewise.tms.dto.SigninRequest;
import com.routewise.tms.dto.SignupRequest;
import com.routewise.tms.dto.UserUpdateRequest;

public interface AuthService {
    Object register(SignupRequest request);
    Object login(SigninRequest request);
    Object updateUser(UserUpdateRequest request, String authHeader);
    Object logout(String authHeader);
    Object refreshToken(RefreshTokenRequest request);
}
