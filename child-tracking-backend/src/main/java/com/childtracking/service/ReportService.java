package com.childtracking.service;

import com.childtracking.dto.ReportRequest;
import com.childtracking.dto.ReportResponse;
import com.childtracking.model.Report;
import com.childtracking.model.User;
import com.childtracking.repository.ReportRepository;
import com.childtracking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AiDuplicateService aiDuplicateService;
    private final NotificationService notificationService;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         AiDuplicateService aiDuplicateService,
                         NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.aiDuplicateService = aiDuplicateService;
        this.notificationService = notificationService;
    }

    public ReportResponse submitReport(ReportRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();
        report.setChildName(request.getChildName());
        report.setAge(request.getAge());
        report.setGender(request.getGender());
        report.setPhysicalDescription(request.getPhysicalDescription());
        report.setLastSeenLocation(request.getLastSeenLocation());
        report.setDateLastSeen(LocalDate.parse(request.getDateLastSeen()));
        report.setStatus("active");
        report.setImagePath(request.getImagePath());
        report.setSubmittedBy(user);

        Report saved = reportRepository.save(report);
        aiDuplicateService.checkForDuplicate(saved);
        notificationService.sendAlertNotifications(saved);
        return mapToResponse(saved);
    }

    public ReportResponse markAsFound(String id, String userEmail, String foundNote) {
        Report report = reportRepository.findById(java.util.UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if ("found".equals(report.getStatus())) {
            throw new RuntimeException("This child has already been marked as found");
        }

        report.setStatus("found");
        if (foundNote != null && !foundNote.isBlank()) {
            report.setFoundNote(foundNote.trim());
        }
        Report saved = reportRepository.save(report);
        notificationService.sendFoundNotification(saved);
        return mapToResponse(saved);
    }

    public List<ReportResponse> getAllActiveReports() {
        return reportRepository.findByStatus("active")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> searchByName(String name) {
        return reportRepository.findByChildNameContainingIgnoreCaseAndStatus(name, "active")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> searchByLocation(String location) {
        return reportRepository.findByLastSeenLocationContainingIgnoreCaseAndStatus(location, "active")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReportResponse getReportById(String id) {
        Report report = reportRepository.findById(java.util.UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return mapToResponse(report);
    }

    private ReportResponse mapToResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setReportId(report.getReportId().toString());
        response.setChildName(report.getChildName());
        response.setAge(report.getAge());
        response.setGender(report.getGender());
        response.setPhysicalDescription(report.getPhysicalDescription());
        response.setLastSeenLocation(report.getLastSeenLocation());
        response.setDateLastSeen(report.getDateLastSeen().toString());
        response.setImagePath(report.getImagePath());
        response.setStatus(report.getStatus());
        response.setSubmittedBy(report.getSubmittedBy().getFullName());
        response.setCreatedAt(report.getCreatedAt().toString());
        response.setFoundNote(report.getFoundNote());
        return response;
    }
}