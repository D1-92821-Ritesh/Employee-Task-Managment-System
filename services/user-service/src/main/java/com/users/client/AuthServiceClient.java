package com.users.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Client to communicate with Auth Service for credential management
 */
@Service
public class AuthServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceClient.class);

    private final RestTemplate restTemplate;
    private final String authServiceUrl;

    public AuthServiceClient(RestTemplate restTemplate,
                             @Value("${auth.service.url:http://localhost:8081}") String authServiceUrl) {
        this.restTemplate = restTemplate;
        this.authServiceUrl = authServiceUrl;
    }

    /**
     * Register user credentials in Auth Service
     * @param firstName User's first name
     * @param email User's email (used as username)
     * @param password User's password
     * @param role User's role (e.g., EMPLOYEE, MANAGER, ADMIN
     * @throws RuntimeException if registration fails
     */
    public void registerCredentials(String firstName, String email, String password, String role) {
        String url = authServiceUrl + "/api/auth/register";

        AuthRegisterRequest request = new AuthRegisterRequest(firstName, email, password, role);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AuthRegisterRequest> entity = new HttpEntity<>(request, headers);

        try {
            log.info("Registering credentials in Auth Service for: {}", email);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Auth Service registration successful for: {}", email);
                return;
            }

            log.error("Auth Service registration failed with status: {}", response.getStatusCode());
            throw new RuntimeException("Auth registration failed: " + response.getBody());

        } catch (HttpClientErrorException e) {
            log.error("Auth Service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());

            // If user already exists in Auth Service, we might want to continue
            if (e.getStatusCode() == HttpStatus.CONFLICT ||
                    e.getResponseBodyAsString().contains("already exists")) {
                log.warn("User already exists in Auth Service, continuing with local registration");
            }

            throw new RuntimeException("Auth registration failed: " + e.getResponseBodyAsString());

        } catch (RestClientException e) {
            log.error("Failed to connect to Auth Service: {}", e.getMessage());
            throw new RuntimeException("Failed to connect to Auth Service: " + e.getMessage());
        }
    }

    /**
     * Delete user credentials from Auth Service (for rollback/compensation)
     * Note: This requires Auth Service to have a delete endpoint
     */
    public void deleteCredentials(String email) {
        String url = authServiceUrl + "/api/auth/users/" + email;
        try {
            log.warn("Rolling back registration: Deleting credentials for {}", email);
            restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
            log.info("Successfully deleted credentials for {}", email);
        } catch (Exception e) {
            log.error("Failed to rollback/delete credentials for {}: {}", email, e.getMessage());
            // We log error but don't throw, as we are already handling an exception
        }
    }
}
