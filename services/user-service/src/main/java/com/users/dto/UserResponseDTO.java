package com.users.dto;

import java.time.LocalDateTime;

import com.users.entity.Department;
import com.users.entity.Role;

import lombok.Data;

@Data
public class UserResponseDTO {
	
	private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private boolean status;
    private Department department;
    private Long managerId;
    private LocalDateTime createOn;
    private LocalDateTime updatedOn;
}
