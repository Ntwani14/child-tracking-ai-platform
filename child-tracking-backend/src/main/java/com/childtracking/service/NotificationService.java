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

    public NotificationService(NotificationRepository notificationRepository,
                                UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * When a new report is submitted, notify all users whose location
     * matches or is near the report's last seen location.
     */
    public void sendAlertNotifications(Report report) {
        List<User> allUsers = userRepository.findAll();

        // Find users whose location matches the report area
        String reportLocation = report.getLastSeenLocation().toLowerCase();

        List<User> relevantUsers = allUsers.stream()
            .filter(user -> {
                if (user.getLocation() == null || user.getLocation().isBlank()) return false;
                String userLocation = user.getLocation().toLowerCase();
                // Check if any word in user location matches report location
                String[] userWords = userLocation.split("[,\\s]+");
                for (String word : userWords) {
                    if (word.length() > 2 && reportLocation.contains(word)) return true;
                }
                return false;
            })
            .collect(Collectors.toList());

        // If no location match, notify all users anyway (small community platform)
        if (relevantUsers.isEmpty()) {
            relevantUsers = allUsers;
        }

        // Create notification for each relevant user (excluding the submitter)
        for (User user : relevantUsers) {
            if (user.getUserId().equals(report.getSubmittedBy().getUserId())) continue;

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setReport(report);
            notification.setMessage(
                "ALERT: " + report.getChildName() +
                " (" + report.getGender() + ", " + report.getAge() + " years old) " +
                "was last seen at " + report.getLastSeenLocation() +
                " on " + report.getDateLastSeen() + ". " +
                "Please look out for this child and report any information."
            );
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }
}
