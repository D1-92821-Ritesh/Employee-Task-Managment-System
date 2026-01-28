package com.users.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth-service")
public interface AuthFeignClient {

    @PostMapping("/api/auth/register")
    void registerCredentials(@RequestBody AuthRegisterRequest request);

    @DeleteMapping("/api/auth/users/{email}")
    void deleteCredentials(@PathVariable("email") String email);
}
