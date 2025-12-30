package org.wldu.webservices.services.contracts;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.wldu.webservices.auths.User;
import org.wldu.webservices.auths.UserRepository;
import org.wldu.webservices.dtoFiles.NotificationResponse;
import org.wldu.webservices.enities.Notification;
import org.wldu.webservices.repositories.NotificationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getUserNotificationsByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notification -> {
                    NotificationResponse res = new NotificationResponse();
                    res.setId(notification.getId());
                    res.setMessage(notification.getMessage());
                    res.setSeen(notification.isSeen());
                    res.setCreatedAt(notification.getCreatedAt());
                    return res;
                })
                .toList();
    }

    public void create(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
