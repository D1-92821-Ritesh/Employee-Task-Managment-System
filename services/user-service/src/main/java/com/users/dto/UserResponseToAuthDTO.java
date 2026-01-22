package com.users.dto;

import com.users.entity.Role;

public class UserResponseToAuthDTO {
	 private Long id;
     private String firstName;
     private String email;
     private String password;
     private Role role; // Optional, default to EMPLOYEE if null
}
