package com.etms.gateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Public endpoints that don't require authentication
    public static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login");

    // Role-based access control rules
    // Maps endpoint patterns to allowed roles
    public static final Map<String, List<String>> ROLE_ACCESS_RULES = Map.ofEntries(
            // User Service endpoints
            Map.entry("GET:/api/users", List.of("ADMIN")),
            Map.entry("POST:/api/users", List.of("ADMIN")),
            Map.entry("DELETE:/api/users/", List.of("ADMIN")),

            // Auth Service management
            Map.entry("DELETE:/api/auth/users/", List.of("ADMIN")),

            // Task Service endpoints
            Map.entry("POST:/api/tasks", List.of("MANAGER")),
            Map.entry("GET:/api/tasks", List.of("MANAGER", "EMPLOYEE")),
            Map.entry("PUT:/api/tasks/{id}", List.of("MANAGER")),
            Map.entry("DELETE:/api/tasks/{id}", List.of("MANAGER")),
            Map.entry("PATCH:/api/tasks/{id}/status", List.of("MANAGER", "EMPLOYEE")),

            // Comments
            Map.entry("POST:/api/tasks/{id}/comments", List.of("MANAGER", "EMPLOYEE")),
            Map.entry("PUT:/api/tasks/{id}/comments/{cid}", List.of("MANAGER", "EMPLOYEE")));

    public Predicate<ServerHttpRequest> isSecured = request -> PUBLIC_ENDPOINTS.stream()
            .noneMatch(uri -> request.getURI().getPath().contains(uri));

    public boolean isPublicEndpoint(String path) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(path::contains);
    }

    /**
     * Check if a role has access to a specific endpoint
     * 
     * @param method HTTP method (GET, POST, PUT, DELETE)
     * @param path   Request path
     * @param role   User's role
     * @return true if access is allowed
     */
    public boolean hasAccess(String method, String path, String role) {
        String key = method + ":" + path;

        // Check exact match first
        if (ROLE_ACCESS_RULES.containsKey(key)) {
            return ROLE_ACCESS_RULES.get(key).contains(role);
        }

        // Check prefix matches for parameterized paths
        for (Map.Entry<String, List<String>> entry : ROLE_ACCESS_RULES.entrySet()) {
            String ruleKey = entry.getKey();
            if (matchesPattern(ruleKey, key)) {
                return entry.getValue().contains(role);
            }
        }

        // If no specific rule found, allow access (service-level authorization will
        // handle)
        // For more restrictive setup, return false here
        return true;
    }

    private boolean matchesPattern(String pattern, String actual) {
        // Simple pattern matching - can be enhanced with regex if needed
        String[] patternParts = pattern.split("/");
        String[] actualParts = actual.split("/");

        if (patternParts.length != actualParts.length) {
            return false;
        }

        for (int i = 0; i < patternParts.length; i++) {
            if (!patternParts[i].equals(actualParts[i]) && !patternParts[i].startsWith("{")) {
                return false;
            }
        }

        return true;
    }
}
