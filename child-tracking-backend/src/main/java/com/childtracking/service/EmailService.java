package com.childtracking.service;

import com.childtracking.model.Report;
import com.childtracking.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:noreply@childtracking.co.za}")
    private String fromEmail;

    @Value("${app.email.from-name:MCRS Alerts}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a missing-child alert email to a list of users when a new report is submitted.
     */
    public void sendAlertEmails(Report report, List<User> users) {
        if (!emailEnabled) {
            logger.info("Email notifications disabled. Set EMAIL_ENABLED=true to enable.");
            return;
        }

        String subject = "MISSING CHILD ALERT: " + report.getChildName() + " (" + report.getAge() + ", last seen " + report.getLastSeenLocation() + ")";
        String body = buildAlertBody(report);

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isBlank()) continue;
            // Skip the person who submitted the report
            if (user.getUserId().equals(report.getSubmittedBy().getUserId())) continue;
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderFrom());
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                logger.info("Alert email sent to: " + user.getEmail());
            } catch (Exception e) {
                logger.warning("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Sends duplicate flag notification to admin users.
     */
    public void sendDuplicateAlert(Report newReport, Report matchedReport, double score, List<User> admins) {
        if (!emailEnabled) return;

        String subject = "Possible Duplicate Report: " + newReport.getChildName();
        String body = String.format(
            "AUTOMATED DUPLICATE DETECTION\n" +
            "=============================\n\n" +
            "The AI duplicate-detection module has flagged a newly submitted report\n" +
            "as a possible duplicate of an existing case. Please review it in the admin panel.\n\n" +
            "NEW REPORT\n" +
            "  Child:    %s (%s, %d years old)\n" +
            "  Location: %s\n" +
            "  ID:       %s\n\n" +
            "POSSIBLE MATCH\n" +
            "  Child:    %s\n" +
            "  Location: %s\n" +
            "  ID:       %s\n\n" +
            "Similarity score: %.1f%%\n\n" +
            "Review and resolve this flag here:\n" +
            "http://localhost:3000/admin\n\n" +
            "---\n" +
            "Missing Children Reporting System (automated message)",
            newReport.getChildName(), newReport.getGender(), newReport.getAge(),
            newReport.getLastSeenLocation(), newReport.getReportId(),
            matchedReport.getChildName(), matchedReport.getLastSeenLocation(), matchedReport.getReportId(),
            score * 100
        );

        for (User admin : admins) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderFrom());
                message.setTo(admin.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
            } catch (Exception e) {
                logger.warning("Failed to send duplicate alert to admin: " + e.getMessage());
            }
        }
    }

    /**
     * Sends good-news email to all users when a child is found.
     */
    public void sendFoundEmails(Report report, List<User> users) {
        if (!emailEnabled) return;

        String subject = "GOOD NEWS: " + report.getChildName() + " has been found safe";
        String body = buildFoundBody(report);

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isBlank()) continue;
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderFrom());
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                logger.info("Found email sent to: " + user.getEmail());
            } catch (Exception e) {
                logger.warning("Failed to send found email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    private String buildAlertBody(Report report) {
        String reporter = report.getSubmittedBy() != null && report.getSubmittedBy().getFullName() != null
                ? report.getSubmittedBy().getFullName()
                : "a community member";

        return String.format(
            "MISSING CHILD ALERT\n" +
            "===================\n\n" +
            "A new missing children report has been submitted to your community\n" +
            "platform. Please read the details below and share with people you trust.\n\n" +
            "CHILD INFORMATION\n" +
            "  Name:       %s\n" +
            "  Age:        %d years old\n" +
            "  Gender:     %s\n" +
            "  Last seen:  %s\n" +
            "  Location:   %s\n\n" +
            "DESCRIPTION\n" +
            "  %s\n\n" +
            "Reported by: %s\n\n" +
            "WHAT YOU CAN DO\n" +
            "  - If you have seen this child, open the report and use the\n" +
            "    \"I Found This Child\" button so the whole community is updated.\n" +
            "  - Contact your nearest police station, or call the South African\n" +
            "    Police Service on 10111, or Missing Children SA on 072 647 7464.\n\n" +
            "View the full report:\n" +
            "http://localhost:3000/reports/%s\n\n" +
            "---\n" +
            "Missing Children Reporting System\n" +
            "This is an automated alert. Please do not reply to this email.",
            report.getChildName(), report.getAge(), report.getGender(),
            report.getDateLastSeen(), report.getLastSeenLocation(),
            report.getPhysicalDescription(), reporter, report.getReportId()
        );
    }

    private String buildFoundBody(Report report) {
        return String.format(
            "GOOD NEWS FROM YOUR COMMUNITY\n" +
            "============================\n\n" +
            "%s (%s, %d years old), who was last seen at %s,\n" +
            "has been FOUND and is safe.\n\n" +
            "Thank you to every community member who shared this report and kept\n" +
            "watch. Your attention and quick action make a real difference.\n\n" +
            "This case is now closed on the platform. No further action is needed.\n\n" +
            "---\n" +
            "Missing Children Reporting System\n" +
            "This is an automated notification. Please do not reply to this email.",
            report.getChildName(), report.getGender(), report.getAge(),
            report.getLastSeenLocation()
        );
    }
    /**
     * Sends a password-reset code to a single user. Returns true if the send succeeded.
     */
    public boolean sendPasswordResetEmail(User user, String code) {
        if (!emailEnabled) {
            logger.info("Email disabled - reset code for " + user.getEmail() + " is: " + code);
            return false;
        }
        String subject = "Your password reset code: " + code;
        String body = String.format(
            "PASSWORD RESET REQUEST\n" +
            "======================\n\n" +
            "Hello %s,\n\n" +
            "We received a request to reset the password for your Missing Children\n" +
            "Reporting System account.\n\n" +
            "Your reset code is:\n\n" +
            "    %s\n\n" +
            "Enter this code on the reset page to choose a new password.\n" +
            "This code will expire in 15 minutes.\n\n" +
            "If you did not request this, you can safely ignore this email and your\n" +
            "password will stay the same.\n\n" +
            "---\n" +
            "Missing Children Reporting System\n" +
            "This is an automated message. Please do not reply.",
            user.getFullName() != null ? user.getFullName() : "there", code
        );
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderFrom());
            message.setTo(user.getEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Password reset email sent to: " + user.getEmail());
            return true;
        } catch (Exception e) {
            logger.warning("Failed to send reset email to " + user.getEmail() + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Builds the "From" value with a friendly display name, e.g.
     * "Missing Children System <ntwano14@gmail.com>". Falls back to the raw
     * address if the name is blank.
     */
    private String senderFrom() {
        if (fromName == null || fromName.isBlank()) {
            return fromEmail;
        }
        return fromName + " <" + fromEmail + ">";
    }
}