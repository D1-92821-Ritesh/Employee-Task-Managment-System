package com.users;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import com.users.entity.User;
import com.users.entity.Role;
import com.users.entity.Department;
import com.users.repository.UserRepository;

@SpringBootApplication
@EnableFeignClients
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner commandLineRunner(UserRepository repository) {
		return args -> {
			// Create Admin user (must match auth-service)
			if (repository.findByEmail("admin@etms.com").isEmpty()) {
				User admin = new User();
				admin.setId(1L); // Same ID as in auth-service
				admin.setFirstName("Admin");
				admin.setLastName("User");
				admin.setEmail("admin@etms.com");
				admin.setRole(Role.ADMIN);
				admin.setDepartment(Department.DEVELOPMENT);
				admin.setStatus(true);
				repository.save(admin);
				System.out.println("Created default admin user: admin@etms.com with ID: 1");
			}

			// Create Manager user (must match auth-service)
			if (repository.findByEmail("manager@etms.com").isEmpty()) {
				User manager = new User();
				manager.setId(2L); // Same ID as in auth-service
				manager.setFirstName("Manager");
				manager.setLastName("User");
				manager.setEmail("manager@etms.com");
				manager.setRole(Role.MANAGER);
				manager.setDepartment(Department.DEVELOPMENT);
				manager.setStatus(true);
				repository.save(manager);
				System.out.println("Created default manager user: manager@etms.com with ID: 2");
			}
		};
	}
}
