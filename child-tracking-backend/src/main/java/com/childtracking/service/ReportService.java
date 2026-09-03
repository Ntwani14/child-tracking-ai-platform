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

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         AiDuplicateService aiDuplicateService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.aiDuplicateService = aiDuplicateService;
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

        // Trigger AI duplicate detection asynchronously
        aiDuplicateService.checkForDuplicate(saved);

        return mapToResponse(saved);
    }

    public List<ReportResponse> getAllActiveReports() {
        return reportRepository.findByStatus("active")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> searchByName(String name) {
        return reportRepository.findByChildNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> searchByLocation(String location) {
        return reportRepository.findByLastSeenLocationContainingIgnoreCase(location)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReportResponse getReportById(String id) {
        Report report = reportRepository.findById(java.util.UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return mapToResponse(report);
    }

    // Map Report entity to ReportResponse DTO
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
        return response;
    }
}
