package org.wldu.webservices.auths;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// --- Request DTO ---
@Data
@NoArgsConstructor
@AllArgsConstructor
class AuthRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// --- Response DTO ---
@Data
@NoArgsConstructor // Required for JSON serialization
class AuthResponse {
    private String token;
    private User user; // The missing piece that carries the ROLE

    // Constructor to match: return ResponseEntity.ok(new AuthResponse(token, user));
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}