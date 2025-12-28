package org.wldu.webservices.auths;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.wldu.webservices.dto.ResetPasswordDto;

import java.util.List;

@Service
public class UsersService {

    private final UsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository userRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Users getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    public Users register(RegisterRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Set role WITHOUT "ROLE_" prefix
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole("ADMIN");
        } else if (request.getRole() != null && request.getRole().equalsIgnoreCase("WORKER")) {
            user.setRole("WORKER");
        } else {
            user.setRole("VIEWER"); // ✅ Fix typo: "VIEWER" not "VIWER"
        }

        return userRepository.save(user);
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users updateUser(Long id, RegisterRequestDto request) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Set role WITHOUT "ROLE_" prefix
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole("ADMIN");
        } else if (request.getRole() != null && request.getRole().equalsIgnoreCase("WORKER")) {
            user.setRole("WORKER");
        } else {
            user.setRole("VIEWER"); // ✅ Fix typo
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public void assignRole(Long userId, String role) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Accept "ADMIN", "WORKER", "VIEWER" (without ROLE_ prefix)
        if (!role.equalsIgnoreCase("VIEWER")
                && !role.equalsIgnoreCase("ADMIN")
                && !role.equalsIgnoreCase("WORKER")) {
            throw new RuntimeException("Invalid role. Use: ADMIN, WORKER, or VIEWER");
        }

        // ✅ Set role WITHOUT "ROLE_" prefix
        user.setRole(role.toUpperCase()); // e.g., "ADMIN"

        userRepository.save(user);
    }
    public boolean changeOwnPassword(String username, ResetPasswordDto request) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return false; // Current password is wrong
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return true;
    }

    // Admin can reset any user's password (no current password check)
    public void adminResetPassword(Long userId, String newPassword) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Users activateUser(Long id) {
        Users user = getUserById(id);
        user.setActive(true);
        return userRepository.save(user);
    }

    public Users deactivateUser(Long id) {
        Users user = getUserById(id);
        user.setActive(false);
        return userRepository.save(user);
    }
}