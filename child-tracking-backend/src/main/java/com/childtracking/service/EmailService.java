package com.childtracking.service;

import com.childtracking.model.Report;
import com.childtracking.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    /**
     * Delegate email sending to the Python AI service which handles SMTP.
     * This avoids Render's SMTP port blocking on the Java service.
     */
    private void sendViaAiService(List<String> recipients, String subject, String body) {
        if (!emailEnabled) {
            logger.info("Email disabled — skipping send.");
            return;
        }
        if (recipients.isEmpty()) {
            logger.info("No recipients — skipping send.");
            return;
        }
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("recipients", recipients);
            payload.put("subject", subject);
            payload.put("body", body);

            String url = aiServiceUrl + "/send-email";
            logger.info("Calling Python email service at " + url + " for " + recipients.size() + " recipients");

            ResponseEntity<Map> response = restTemplate.postForEntity(url, payload, Map.class);
            logger.info("Email service response: " + response.getBody());
        } catch (Exception e) {
            logger.severe("Failed to call Python email service: " + e.getMessage());
        }
    }

    public void sendAlertEmails(Report report, List<User> users) {
        if (!emailEnabled) return;

        List<String> recipients = users.stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .filter(u -> !u.getUserId().equals(report.getSubmittedBy().getUserId()))
                .map(User::getEmail)
                .collect(Collectors.toList());

        String subject = "MISSING CHILD ALERT: " + report.getChildName()
                + " (" + report.getAge() + ", last seen " + report.getLastSeenLocation() + ")";
        String body = buildAlertBody(report);

        sendViaAiService(recipients, subject, body);
    }

    public void sendFoundEmails(Report report, List<User> users) {
        logger.info("sendFoundEmails called. emailEnabled=" + emailEnabled + ", users=" + users.size());
        if (!emailEnabled) return;

        List<String> recipients = users.stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .map(User::getEmail)
                .collect(Collectors.toList());

        String subject = "GOOD NEWS: " + report.getChildName() + " has been found safe";
        String body = buildFoundBody(report);

        sendViaAiService(recipients, subject, body);
    }

    public void sendDuplicateAlert(Report newReport, Report matchedReport, double score, List<User> admins) {
        if (!emailEnabled) return;

        List<String> recipients = admins.stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .map(User::getEmail)
                .collect(Collectors.toList());

        String subject = "Possible Duplicate Report: " + newReport.getChildName();
        String body = String.format(
            "AUTOMATED DUPLICATE DETECTION\n" +
            "=============================\n\n" +
            "NEW REPORT\n" +
            "  Child:    %s (%s, %d years old)\n" +
            "  Location: %s\n\n" +
            "POSSIBLE MATCH\n" +
            "  Child:    %s\n" +
            "  Location: %s\n\n" +
            "Similarity score: %.1f%%\n\n" +
            "Review here: " + frontendUrl + "/admin\n\n" +
            "---\nMissing Children Reporting System (automated message)",
            newReport.getChildName(), newReport.getGender(), newReport.getAge(),
            newReport.getLastSeenLocation(),
            matchedReport.getChildName(), matchedReport.getLastSeenLocation(),
            score * 100
        );

        sendViaAiService(recipients, subject, body);
    }

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
            "Your reset code is:\n\n    %s\n\n" +
            "Enter this code on the reset page. It expires in 15 minutes.\n\n" +
            "If you did not request this, ignore this email.\n\n" +
            "---\nMissing Children Reporting System",
            user.getFullName() != null ? user.getFullName() : "there", code
        );
        try {
            sendViaAiService(List.of(user.getEmail()), subject, body);
            return true;
        } catch (Exception e) {
            logger.warning("Failed to send reset email: " + e.getMessage());
            return false;
        }
    }

    private String buildAlertBody(Report report) {
        String reporter = report.getSubmittedBy() != null ? report.getSubmittedBy().getFullName() : "a community member";
        return String.format(
            "MISSING CHILD ALERT\n" +
            "===================\n\n" +
            "CHILD INFORMATION\n" +
            "  Name:       %s\n" +
            "  Age:        %d years old\n" +
            "  Gender:     %s\n" +
            "  Last seen:  %s\n" +
            "  Location:   %s\n\n" +
            "DESCRIPTION\n  %s\n\n" +
            "Reported by: %s\n\n" +
            "If you have seen this child:\n" +
            "  - Click \"I Found This Child\" on the report\n" +
            "  - Call SAPS on 10111 or Missing Children SA on 072 647 7464\n\n" +
            "View report: " + frontendUrl + "/reports/%s\n\n" +
            "---\nMissing Children Reporting System\nThis is an automated alert.",
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
            "Thank you to every community member who shared this report.\n" +
            "This case is now closed. No further action is needed.\n\n" +
            "---\nMissing Children Reporting System\nThis is an automated notification.",
            report.getChildName(), report.getGender(), report.getAge(),
            report.getLastSeenLocation()
        );
    }
}
