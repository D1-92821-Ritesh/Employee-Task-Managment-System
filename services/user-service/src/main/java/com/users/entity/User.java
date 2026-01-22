package com.users.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "email")
    private String email;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(name = "status", columnDefinition = "TINYINT(1)")
    private boolean status;
    
    @Enumerated(EnumType.STRING)
    private Department department;
    
    @Column(name = "manager_id")
    private Long managerId;
    
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createOn;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedOn;
}










