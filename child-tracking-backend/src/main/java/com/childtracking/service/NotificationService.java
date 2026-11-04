package com.childtracking.service;

import com.childtracking.model.Notification;
import com.childtracking.model.Report;
import com.childtracking.model.User;
import com.childtracking.repository.NotificationRepository;
import com.childtracking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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
     * Sends a missing-child alert to ALL registered users (community-wide alert),
     * regardless of their saved location. The user who submitted the report is skipped.
     */
    /**
     * Send alert notifications when a new report is submitted.
     * Saves in-app notifications and sends emails.
     */
    public void sendAlertNotifications(Report report) {
        List<User> allUsers = userRepository.findAll();

        // Save in-app notifications for every user except the submitter
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

        // Send email alerts to all users (EmailService skips the submitter and blank emails)
        emailService.sendAlertEmails(report, allUsers);
    }


    /**
     * Send "found" notifications when a child is marked safe.
     * Saves in-app notifications and sends emails.
     */
    public void sendFoundNotification(Report report) {
        logger.info("sendFoundNotification called for report: " + report.getReportId());
        List<User> allUsers = userRepository.findAll();
        logger.info("Found " + allUsers.size() + " users to notify");

        String message = "GREAT NEWS! " + report.getChildName() +
                " (" + report.getGender() + ", " + report.getAge() + " years old) " +
                "who was last seen at " + report.getLastSeenLocation() +
                " has been FOUND safely. Thank you to everyone who helped!";

        // Save in-app notification for all users
        for (User user : allUsers) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setReport(report);
            notification.setMessage(message);
            notificationRepository.save(notification);
        }
        logger.info("In-app notifications saved for " + allUsers.size() + " users");

        // Send email to all users
        try {
            emailService.sendFoundEmails(report, allUsers);
            logger.info("Email send completed for found notification");
        } catch (Exception e) {
            logger.severe("FAILED to send found emails: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }
}
