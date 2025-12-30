package org.wldu.webservices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/api/tasks/create").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/assign").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/get-all").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/unassigned").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/update/**").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/delete/**").hasRole("ADMIN")
                        .requestMatchers("/api/tasks/{taskId}/**").permitAll()
                        .requestMatchers("/api/tasks/category/**").permitAll()
                        .requestMatchers("/api/tasks/status/**").permitAll()
                        .requestMatchers("/api/tasks/my-tasks").permitAll()

                        .requestMatchers("/api/categories/create-categories").hasRole("ADMIN")
                        .requestMatchers("/api/categories/list-categories").permitAll()
                        .requestMatchers("/api/notifications/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/comments/**").hasAnyRole("USER", "ADMIN")

                        .anyRequest().authenticated()
                )
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
