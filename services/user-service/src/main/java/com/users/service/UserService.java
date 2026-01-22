package com.users.service;

import com.users.dto.UserCreateDTO;
import com.users.dto.UserResponseDTO;
import com.users.dto.UserUpdateDTO;
import com.users.entity.User;
import com.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    // Get all employees (Returning DTOs)
    public List<UserResponseDTO> getAllUsers() {
        return repository.findAll().stream()
                .map(this::mapToResponse) // calling local helper method
                .collect(Collectors.toList());
    }

    // Get single employee (returning DTO)
    public UserResponseDTO getUserById(Long id) {
        User user = repository.findById(id).orElse(null);
        if (user == null) return null;
        return mapToResponse(user);
    }

    // Create employee (accepting DTO, returning DTO)
    public UserResponseDTO createUser(UserCreateDTO createDto) {
        // converting userDTO to userEntity 
        User user = new User();
        user.setFirstName(createDto.getFirstName());
        user.setLastName(createDto.getLastName());
        user.setEmail(createDto.getEmail());
        user.setRole(createDto.getRole());
        user.setDepartment(createDto.getDepartment());
        user.setManagerId(createDto.getManagerId());
        user.setStatus(true); 

        User savedUser = repository.save(user);
        return mapToResponse(savedUser);
    }
    
    // update User (accepting ID and UpdateDTO)
    public boolean updateUser(Long id, UserUpdateDTO updateDto) {
        User existingUser = repository.findById(id).orElse(null);
        
        //if user exists
        if (existingUser != null) {
            
            if(updateDto.getFirstName() != null) existingUser.setFirstName(updateDto.getFirstName());
            if(updateDto.getLastName() != null) existingUser.setLastName(updateDto.getLastName());
            if(updateDto.getEmail() != null) existingUser.setEmail(updateDto.getEmail());
            if(updateDto.getRole() != null) existingUser.setRole(updateDto.getRole());
            if(updateDto.getDepartment() != null) existingUser.setDepartment(updateDto.getDepartment());
            if(updateDto.getManagerId() != null) existingUser.setManagerId(updateDto.getManagerId());
            if(updateDto.getStatus() != null) existingUser.setStatus(updateDto.getStatus());

            repository.save(existingUser);
            return true;
        }
        return false;
    }
    
    public boolean deleteUser(Long id) {
        User user = repository.findById(id).orElse(null);
        
        if (user != null) {
            user.setStatus(false); // Soft Delete
            repository.save(user); // Update the record
            return true;
        }
        return false;
    }
    
    // Get by manager
    public List<UserResponseDTO> getUsersByManager(Long managerId) {
        return repository.findByManagerIdAndStatus(managerId, true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    
    // Convert Entity -> DTO
    private UserResponseDTO mapToResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.isStatus());
        dto.setDepartment(user.getDepartment());
        dto.setManagerId(user.getManagerId());
        dto.setCreateOn(user.getCreateOn());
        dto.setUpdatedOn(user.getUpdatedOn());
        return dto;
    }
}


