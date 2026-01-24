package com.etms.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner commandLineRunner(
			com.etms.authservice.repository.UserRepository repository,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			if (repository.findByEmail("admin@etms.com").isEmpty()) {
				var admin = com.etms.authservice.model.Users.builder()
						.firstName("System Admin")
						.email("admin@etms.com")
						.passwordHash(passwordEncoder.encode("admin"))
						.role(com.etms.authservice.model.Role.ADMIN)
						.build();
				repository.save(admin);
				System.out.println("Default Admin seeded: admin@etms.com");
			}
		};
	}
}
