package com.users.service;

import com.users.dto.UserCreateDTO;
import com.users.dto.UserResponseDTO;
import com.users.dto.UserUpdateDTO;
import com.users.entity.User;
import com.users.exception.ResourceNotFoundException;
import com.users.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private ModelMapper modelMapper;

    // Get all employees
    public List<UserResponseDTO> getAllUsers() {
        return repository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    // Get single employee (Throws Exception if not found)
    public UserResponseDTO getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return modelMapper.map(user, UserResponseDTO.class);
    }

    // Create employee
    public UserResponseDTO createUser(UserCreateDTO createDto) {
        // Auto-map DTO to Entity
        User user = modelMapper.map(createDto, User.class);
        
        // Set default values logic
        user.setStatus(true); 

        // Save to DB
        User savedUser = repository.save(user);
        
        // Return Response DTO
        return modelMapper.map(savedUser, UserResponseDTO.class);
    }
    
    // Update User (Throws Exception if not found)
    public UserResponseDTO updateUser(Long id, UserUpdateDTO updateDto) {
        User existingUser = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // ModelMapper magically updates only the fields that are NOT null in the DTO
        // (Assumes you set 'skipNullEnabled(true)' in your MapperConfig)
        modelMapper.map(updateDto, existingUser);

        User updatedUser = repository.save(existingUser);
        
        return modelMapper.map(updatedUser, UserResponseDTO.class);
    }
    
    // Soft Delete User (Throws Exception if not found)
    public void deleteUser(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Soft delete logic
        user.setStatus(false);
        repository.save(user);
    }
    
    // Get by manager (Only Active Users)
    public List<UserResponseDTO> getUsersByManager(Long managerId) {
        // Fetch only active users under this manager
        return repository.findByManagerIdAndStatus(managerId, true).stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
}


