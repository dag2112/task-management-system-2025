package org.wldu.webservices.auths;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Get role from authorities and remove "ROLE_" prefix
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> {
                    // Remove "ROLE_" prefix if present
                    if (auth.startsWith("ROLE_")) {
                        return auth.substring(5); // Remove first 5 chars "ROLE_"
                    }
                    return auth;
                })
                .orElse("VIEWER"); // Default without ROLE_ prefix

        // ✅ Use UserDetails to generate token with authorities
        String token = jwtUtil.generateToken(userDetails);

        // Return both token and role
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", role); // e.g., "ADMIN" not "ROLE_ADMIN"

        return ResponseEntity.ok(response);
    }
}