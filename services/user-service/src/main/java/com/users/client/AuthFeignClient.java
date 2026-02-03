package com.users.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service")
public interface AuthFeignClient {

    @PostMapping("/api/auth/register")
    Long registerCredentials(@RequestBody AuthRegisterRequest request);

    @DeleteMapping("/api/auth/users/{email}")
    void deleteCredentials(@PathVariable("email") String email);

    @PutMapping("/api/auth/users/{email}/status")
    void updateUserStatus(@PathVariable("email") String email, @RequestParam("status") boolean status);
}
