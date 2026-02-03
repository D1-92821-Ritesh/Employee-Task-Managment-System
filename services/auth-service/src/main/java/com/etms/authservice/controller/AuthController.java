package com.etms.authservice.controller;

import com.etms.authservice.dto.AuthDto;
import com.etms.authservice.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<Long> register(@RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> authenticate(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        authService.deleteUser(email);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{email}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable String email, @RequestParam boolean status) {
        authService.updateUserStatus(email, status);
        return ResponseEntity.ok("User status updated successfully");
    }
}
