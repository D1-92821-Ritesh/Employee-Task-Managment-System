package com.users.dto;

import com.users.entity.Department;
import com.users.entity.Role;

import lombok.Data;

@Data
public class UserUpdateDTO {
	
	private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Department department;
    private Long managerId;
    private Boolean status;
    
}
