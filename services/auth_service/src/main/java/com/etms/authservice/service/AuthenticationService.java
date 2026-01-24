package com.etms.authservice.service;

import com.etms.authservice.dto.AuthDto;
import com.etms.authservice.model.Role;
import com.etms.authservice.model.Users;
import com.etms.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public String register(AuthDto.RegisterRequest request) {
                var user = Users.builder()
                                .firstName(request.getFirstName())
                                .email(request.getEmail())
                                .passwordHash(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
                                .build();
                repository.save(user);

                return "User registered successfully";
        }

        public AuthDto.AuthResponse authenticate(AuthDto.LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Users not found"));

                var userDetails = new User(
                                user.getEmail(),
                                user.getPasswordHash(),
                                Collections.singletonList(
                                                new SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole().name())));

                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("role", user.getRole());
                extraClaims.put("userId", user.getId());

                var jwtToken = jwtService.generateToken(userDetails, extraClaims);
                return AuthDto.AuthResponse.builder()
                                .token(jwtToken)
                                .firstName(user.getFirstName())
                                .role(user.getRole().name())
                                .build();
        }
        public void deleteUser(String email) {
                var user = repository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                repository.delete(user);
        }
}
