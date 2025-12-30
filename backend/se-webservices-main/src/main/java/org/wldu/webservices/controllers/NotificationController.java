package org.wldu.webservices.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.auths.User;
import org.wldu.webservices.dtoFiles.NotificationResponse;
import org.wldu.webservices.services.contracts.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public List<NotificationResponse> myNotifications(Authentication auth) {
        String username = auth.getName(); // ✅ SAFE
        return notificationService.getUserNotificationsByUsername(username);
    }
}
