package org.wldu.webservices.auths;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.dto.ResetPasswordDto;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class RegistrationController {

    private final UsersService userService;

    public RegistrationController(UsersService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        Users user = userService.register(request);
        return ResponseEntity.ok("User created successfully");
    }
    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(
            @RequestBody ResetPasswordDto request,
            Authentication authentication   // ✅ injected by Spring
    ) {
        String username = authentication.getName(); // ✅ works now

        boolean success = userService.changeOwnPassword(username, request);

        if (success) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
    }

    // Admin resets user password (simple version)
    @PutMapping("/admin-reset-password/{userId}")
    public ResponseEntity<String> adminResetPassword(
            @PathVariable Long userId,
            @RequestBody String newPassword) {

        userService.adminResetPassword(userId, newPassword);
        return ResponseEntity.ok("Password reset successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activate")
    public ResponseEntity<Users> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    // ✅ Deactivate account (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Users> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }
    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody RegisterRequestDto request) {
        Users updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/assign-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRole(@RequestBody AssignRoleRequestDto request) {
        userService.assignRole(request.getUserId(), request.getRole());
        return ResponseEntity.ok("Role updated successfully");
    }

}
