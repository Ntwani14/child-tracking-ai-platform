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

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends alert email to a list of users when a new report is submitted.
     */
    public void sendAlertEmails(Report report, List<User> users) {
        if (!emailEnabled) {
            logger.info("Email notifications disabled. Set EMAIL_ENABLED=true to enable.");
            return;
        }

        String subject = "ALERT: Missing Child â€” " + report.getChildName();
        String body = buildEmailBody(report);

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isBlank()) continue;
            // Skip the person who submitted the report
            if (user.getUserId().equals(report.getSubmittedBy().getUserId())) continue;
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
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

        String subject = "Duplicate Report Detected â€” " + newReport.getChildName();
        String body = String.format(
            "The AI duplicate detection system has flagged a potential duplicate report.\n\n" +
            "NEW REPORT:\n" +
            "  Child: %s (%s, %d years old)\n" +
            "  Location: %s\n" +
            "  Report ID: %s\n\n" +
            "MATCHED REPORT:\n" +
            "  Child: %s\n" +
            "  Location: %s\n" +
            "  Report ID: %s\n\n" +
            "Similarity Score: %.1f%%\n\n" +
            "Please log in to the admin panel to review and resolve this flag.\n" +
            "http://localhost:3000/admin",
            newReport.getChildName(), newReport.getGender(), newReport.getAge(),
            newReport.getLastSeenLocation(), newReport.getReportId(),
            matchedReport.getChildName(), matchedReport.getLastSeenLocation(), matchedReport.getReportId(),
            score * 100
        );

        for (User admin : admins) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
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
     * Sends good news email to all users when a child is found.
     */
    public void sendFoundEmails(Report report, List<User> users) {
        if (!emailEnabled) return;

        String subject = "GREAT NEWS: " + report.getChildName() + " Has Been Found!";
        String body = String.format(
            "GREAT NEWS FROM THE MISSING CHILDREN SYSTEM\n" +
            "=============================================\n\n" +
            "%s (%s, %d years old) who was last seen at %s\n" +
            "has been FOUND safely!\n\n" +
            "Thank you to every community member who shared this report\n" +
            "and helped bring this child home safely.\n\n" +
            "Together we are making a difference.\n\n" +
            "---\n" +
            "Missing Children Reporting System\n" +
            "This is an automated notification.",
            report.getChildName(), report.getGender(), report.getAge(),
            report.getLastSeenLocation()
        );

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isBlank()) continue;
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
            } catch (Exception e) {
                logger.warning("Failed to send found email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }
    private String buildEmailBody(Report report) {
        return String.format(
            "MISSING CHILD ALERT\n" +
            "====================\n\n" +
            "A new missing children report has been submitted in your area.\n\n" +
            "CHILD INFORMATION:\n" +
            "  Name: %s\n" +
            "  Age: %d years old\n" +
            "  Gender: %s\n" +
            "  Last Seen: %s\n" +
            "  Location: %s\n\n" +
            "DESCRIPTION:\n" +
            "  %s\n\n" +
            "If you have any information about this child, please contact your nearest\n" +
            "police station or call the South African Police Service on 10111.\n\n" +
            "View the full report: http://localhost:3000/reports/%s\n\n" +
            "---\n" +
            "Missing Children Reporting System\n" +
            "This is an automated alert. Do not reply to this email.",
            report.getChildName(), report.getAge(), report.getGender(),
            report.getDateLastSeen(), report.getLastSeenLocation(),
            report.getPhysicalDescription(), report.getReportId()
        );
    }
}