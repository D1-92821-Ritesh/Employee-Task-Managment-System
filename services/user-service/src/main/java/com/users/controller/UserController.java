package com.users.controller;

import com.users.dto.UserCreateDTO;
import com.users.dto.UserResponseDTO;
import com.users.dto.UserUpdateDTO;
import com.users.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserResponseDTO> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public UserResponseDTO create(@RequestBody UserCreateDTO userDto) {
        return userService.createUser(userDto);
    }
    
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        
        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully (Soft Delete)");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userDto) {
    	boolean updated = userService.updateUser(id, userDto);
        if (updated) {
            return ResponseEntity.ok("User updated successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }
    
    @GetMapping("/manager/{managerId}")
    public List<UserResponseDTO> getByManager(@PathVariable Long managerId) {
        return userService.getUsersByManager(managerId);
    }
}













