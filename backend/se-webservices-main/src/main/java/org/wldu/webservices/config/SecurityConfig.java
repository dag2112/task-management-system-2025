package org.wldu.webservices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.wldu.webservices.auths.CustomUserDetailsService;
import org.wldu.webservices.auths.JwtAuthFilter;
import org.wldu.webservices.auths.JwtUtil;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public JwtAuthFilter jwtAuthFilter(
            JwtUtil jwtUtil,
            CustomUserDetailsService userDetailsService
    ) {
        return new JwtAuthFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthFilter jwtAuthFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // ✅ Swagger (ALLOW WITHOUT JWT)
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ✅ Auth endpoints
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/user/register"
                        ).permitAll()

                        // ✅ User management
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/api/tasks/add").hasRole("ADMIN")
                        .requestMatchers("/api/user/assign-role").hasRole("ADMIN")
                        // ✅ TASK ASSIGNMENTS - ADD THIS LINE
                        .requestMatchers("/task-assignments/assign").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/user/change-password")
                        .authenticated()

                        .requestMatchers(HttpMethod.PUT, "/api/user/admin-reset-password/**")
                        .hasRole("ADMIN")

                        // ✅ Public task viewing
                        .requestMatchers("/api/tasks/getAllTasks").permitAll()
                        .requestMatchers("/api/user/**").hasRole("ADMIN")

                        // 🔒 Everything else
                        .anyRequest().authenticated()
                )

                // ❗ IMPORTANT: add JWT filter AFTER permit rules
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
