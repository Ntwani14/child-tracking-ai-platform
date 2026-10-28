package com.childtracking.service;

import com.childtracking.model.Notification;
import com.childtracking.model.Report;
import com.childtracking.model.User;
import com.childtracking.repository.NotificationRepository;
import com.childtracking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository,
                                UserRepository userRepository,
                                EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void sendAlertNotifications(Report report) {
        List<User> allUsers = userRepository.findAll();
        String reportLocation = report.getLastSeenLocation().toLowerCase();

        List<User> relevantUsers = allUsers.stream()
            .filter(user -> {
                if (user.getLocation() == null || user.getLocation().isBlank()) return false;
                String userLocation = user.getLocation().toLowerCase();
                String[] userWords = userLocation.split("[,\\s]+");
                for (String word : userWords) {
                    if (word.length() > 2 && reportLocation.contains(word)) return true;
                }
                return false;
            })
            .collect(Collectors.toList());

        if (relevantUsers.isEmpty()) relevantUsers = allUsers;

        // Save in-app notifications
        for (User user : relevantUsers) {
            if (user.getUserId().equals(report.getSubmittedBy().getUserId())) continue;
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setReport(report);
            notification.setMessage(
                "ALERT: " + report.getChildName() +
                " (" + report.getGender() + ", " + report.getAge() + " years old) " +
                "was last seen at " + report.getLastSeenLocation() +
                " on " + report.getDateLastSeen() + "."
            );
            notificationRepository.save(notification);
        }

        // Send email alerts (only if EMAIL_ENABLED=true)
        emailService.sendAlertEmails(report, relevantUsers);
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }
}