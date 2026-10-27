package com.childtracking.controller;

import com.childtracking.model.Notification;
import com.childtracking.model.User;
import com.childtracking.repository.UserRepository;
import com.childtracking.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                   UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationService.getNotificationsForUser(user);

        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> item = new java.util.LinkedHashMap<>();
            item.put("notificationId", n.getNotificationId().toString());
            item.put("message", n.getMessage());
            item.put("sentAt", n.getSentAt().toString());
            item.put("reportId", n.getReport().getReportId().toString());
            item.put("childName", n.getReport().getChildName());
            item.put("location", n.getReport().getLastSeenLocation());
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
