package com.users.service;

import com.users.client.AuthFeignClient;
import com.users.client.AuthRegisterRequest;
import com.users.dto.UserCreateDTO;
import com.users.dto.UserResponseDTO;
import com.users.dto.UserUpdateDTO;
import com.users.entity.User;
import com.users.exception.ResourceNotFoundException;
import com.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final ModelMapper modelMapper;
    private final AuthFeignClient authFeignClient;

    public List<UserResponseDTO> getAllUsers() {
        return repository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Transactional
    public UserResponseDTO createUser(UserCreateDTO createDto) {
        String roleString = createDto.getRole() != null ? createDto.getRole().name() : "EMPLOYEE";

        Long userId;
        try {
            // Auth-service returns the generated user ID
            userId = authFeignClient.registerCredentials(new AuthRegisterRequest(
                    createDto.getFirstName(),
                    createDto.getEmail(),
                    createDto.getPassword(),
                    roleString));
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }

        try {
            User user = modelMapper.map(createDto, User.class);
            user.setId(userId); // Use the same ID from auth-service
            user.setStatus(true);
            User savedUser = repository.save(user);
            return modelMapper.map(savedUser, UserResponseDTO.class);
        } catch (Exception e) {
            authFeignClient.deleteCredentials(createDto.getEmail());
            throw new RuntimeException("User creation failed (Rolled back): " + e.getMessage());
        }
    }

    public UserResponseDTO updateUser(Long id, UserUpdateDTO updateDto) {
        User existingUser = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        modelMapper.map(updateDto, existingUser);
        User updatedUser = repository.save(existingUser);
        return modelMapper.map(updatedUser, UserResponseDTO.class);
    }

    public void deleteUser(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(false);
        repository.save(user);

        // Sync status with auth-service to prevent login
        try {
            authFeignClient.updateUserStatus(user.getEmail(), false);
        } catch (Exception e) {
            // Log but don't fail - user is already deactivated locally
            System.err.println("Warning: Could not sync status with auth-service: " + e.getMessage());
        }
    }

    public List<UserResponseDTO> getUsersByManager(Long managerId) {
        return repository.findByManagerIdAndStatus(managerId, true).stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
}
