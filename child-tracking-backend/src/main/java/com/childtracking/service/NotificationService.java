package com.childtracking.service;

import com.childtracking.model.Notification;
import com.childtracking.model.Report;
import com.childtracking.model.User;
import com.childtracking.repository.NotificationRepository;
import com.childtracking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Logger;

@Service
public class NotificationService {

    private static final Logger logger = Logger.getLogger(NotificationService.class.getName());

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

    /**
     * Send alert notifications when a new report is submitted.
     * In-app notifications saved synchronously, emails sent in a background thread.
     */
    public void sendAlertNotifications(Report report) {
        List<User> allUsers = userRepository.findAll();

        // Save in-app notifications synchronously
        for (User user : allUsers) {
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

        // Fire email in a true background thread — does NOT block the HTTP response
        final List<User> recipients = allUsers;
        final Report reportRef = report;
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("Background thread: sending alert emails for " + reportRef.getChildName());
                emailService.sendAlertEmails(reportRef, recipients);
                logger.info("Background thread: alert emails done");
            } catch (Exception e) {
                logger.severe("Background thread: alert email failed: " + e.getMessage());
            }
        });
    }

    /**
     * Send found notifications when a child is marked safe.
     * In-app notifications saved synchronously, emails sent in a background thread.
     */
    public void sendFoundNotification(Report report) {
        logger.info("sendFoundNotification called for: " + report.getChildName());
        List<User> allUsers = userRepository.findAll();
        logger.info("Users to notify: " + allUsers.size());

        String message = "GREAT NEWS! " + report.getChildName() +
                " (" + report.getGender() + ", " + report.getAge() + " years old) " +
                "who was last seen at " + report.getLastSeenLocation() +
                " has been FOUND safely. Thank you to everyone who helped!";

        // Save in-app notifications synchronously
        for (User user : allUsers) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setReport(report);
            notification.setMessage(message);
            notificationRepository.save(notification);
        }
        logger.info("In-app notifications saved. Firing email in background...");

        // Fire email in a true background thread — does NOT block the HTTP response
        final List<User> recipients = allUsers;
        final Report reportRef = report;
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("Background thread: sending found emails for " + reportRef.getChildName());
                emailService.sendFoundEmails(reportRef, recipients);
                logger.info("Background thread: found emails done");
            } catch (Exception e) {
                logger.severe("Background thread: found email failed: " + e.getMessage());
            }
        });

        logger.info("sendFoundNotification returning immediately — email fires in background");
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }
}
