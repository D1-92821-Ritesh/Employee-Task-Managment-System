package com.users.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;

// --- ADD THESE IMPORTS FOR VALIDATION ---
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    // ID is set from auth-service, not auto-generated
    private Long id;

    @Column(name = "first_name")
    @NotBlank(message = "First name is required") // Validation
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Column(name = "last_name")
    @NotBlank(message = "Last name is required") // Validation
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    @NotBlank(message = "Email is required") // Validation
    @Email(message = "Please provide a valid email address") // Validation
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role is required") // Validation
    private Role role;

    @Column(name = "status", columnDefinition = "TINYINT(1)")
    private boolean status = true;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Department is required") // Validation
    private Department department;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createOn;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedOn;
}