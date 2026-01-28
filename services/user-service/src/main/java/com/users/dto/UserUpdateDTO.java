package com.users.dto;

import com.users.entity.Department;
import com.users.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateDTO {
    
    // STRICT: Client MUST send this, otherwise 400 Error
    @NotBlank(message = "First name is required") 
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotNull(message = "Role is required")
    private Role role;
    
    @NotNull(message = "Department is required")
    private Department department;
    
    
    private Long managerId;
    
    @NotNull(message = "Status is required")
    private Boolean status;
}











