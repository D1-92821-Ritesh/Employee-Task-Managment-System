package com.etms.gateway.filter;

import com.etms.gateway.config.RouteValidator;
import com.etms.gateway.security.JwtService;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;
    private final RouteValidator routeValidator;

    public AuthenticationFilter(JwtService jwtService, RouteValidator routeValidator) {
        this.jwtService = jwtService;
        this.routeValidator = routeValidator;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        // Skip authentication for public endpoints
        if (routeValidator.isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // Check for Authorization header
        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            return onError(exchange, "Missing Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Invalid Authorization header format", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            // Validate token
            if (!jwtService.isTokenValid(token)) {
                return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }

            // Extract user information from token
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            Long userId = jwtService.extractUserId(token);

            // Check role-based access
            if (!routeValidator.hasAccess(method, path, role)) {
                return onError(exchange, "Access denied. Insufficient permissions.", HttpStatus.FORBIDDEN);
            }

            // Add user information to request headers for downstream services
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Email", username)
                    .header("X-User-Role", role)
                    .header("X-User-Id", userId != null ? userId.toString() : "")
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            return onError(exchange, "Error processing token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @SuppressWarnings("null")
    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");

        String body = String.format("{\"error\": \"%s\", \"status\": %d}", message, status.value());

        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1; // Execute before other filters
    }
}
