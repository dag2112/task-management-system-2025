package org.wldu.webservices.auths;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER =================
    public User register(RegisterRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(resolveRole(request.getRole()));
        user.setActive(true);

        return userRepository.save(user);
    }

    // ================= GET ALL =================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= UPDATE =================
    public User updateUser(Long id, RegisterRequestDto request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(resolveRole(request.getRole()));

        return userRepository.save(user);
    }

    // ================= DELETE =================
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    // ================= ROLE MANAGEMENT =================
    public void assignRole(Long userId, String role) {
        User user = getUserById(userId);
        user.setRole(resolveRole(role));
        userRepository.save(user);
    }

    public void revokeRole(Long userId) {
        User user = getUserById(userId);
        user.setRole("ROLE_USER"); // default role
        userRepository.save(user);
    }

    // ================= ACCOUNT STATUS =================
    public void activateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(true);
        userRepository.save(user);
    }

    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    // ================= REST PASSWORD  =================
    public void resetPassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    // ================= HELPER METHODS =================
    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String resolveRole(String role) {
        if (role == null) return "ROLE_USER";

        switch (role.toUpperCase()) {
            case "ADMIN":
                return "ROLE_ADMIN";
            default:
                return "ROLE_USER";
        }
    }

    public void toggleActivation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive()); // switch state
        userRepository.save(user);
    }

}
