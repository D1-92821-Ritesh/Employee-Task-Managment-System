package com.users.dto;

import com.users.entity.Department;
import com.users.entity.Role;

import lombok.Data;

@Data
public class UserCreateDTO {
	
	private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    private Department department;
    private Long managerId;
}
