package com.users.client;

import lombok.Data;

/**
 * DTO to send registration request to Auth Service
 */
@Data
public class AuthRegisterRequest {
    private String firstName;
    private String email;
    private String password;
    private String role;

    public AuthRegisterRequest(String firstName, String email, String password, String role) {
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        // Convert ROLE_EMPLOYEE -> EMPLOYEE for Auth Service format
        this.role = role != null && role.startsWith("ROLE_")
                ? role.substring(5)
                : role;
    }
}
