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
			// Create Admin user
			if (repository.findByEmail("admin@etms.com").isEmpty()) {
				var admin = com.etms.authservice.model.Users.builder()
						.firstName("Admin")
						.email("admin@etms.com")
						.passwordHash(passwordEncoder.encode("password"))
						.role(com.etms.authservice.model.Role.ADMIN)
						.build();
				repository.save(admin);
				System.out.println("Created default admin user: admin@etms.com");
			}

			// Create Manager user
			if (repository.findByEmail("manager@etms.com").isEmpty()) {
				var manager = com.etms.authservice.model.Users.builder()
						.firstName("Manager")
						.email("manager@etms.com")
						.passwordHash(passwordEncoder.encode("password"))
						.role(com.etms.authservice.model.Role.MANAGER)
						.build();
				repository.save(manager);
				System.out.println("Created default manager user: manager@etms.com");
			}
		};
	}
}
