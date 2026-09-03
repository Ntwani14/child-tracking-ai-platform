package com.childtracking.controller;

import com.childtracking.model.DuplicateFlag;
import com.childtracking.model.Report;
import com.childtracking.repository.DuplicateFlagRepository;
import com.childtracking.repository.ReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final DuplicateFlagRepository duplicateFlagRepository;
    private final ReportRepository reportRepository;

    public AdminController(DuplicateFlagRepository duplicateFlagRepository,
                           ReportRepository reportRepository) {
        this.duplicateFlagRepository = duplicateFlagRepository;
        this.reportRepository = reportRepository;
    }

    // GET /api/admin/duplicate-flags — get all unreviewed duplicate flags
    @GetMapping("/duplicate-flags")
    public ResponseEntity<List<Map<String, Object>>> getDuplicateFlags() {
        List<DuplicateFlag> flags = duplicateFlagRepository.findByReviewed(false);

        List<Map<String, Object>> result = flags.stream().map(flag -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("flagId", flag.getFlagId().toString());
            item.put("similarityScore", flag.getSimilarityScore());
            item.put("reviewed", flag.getReviewed());
            item.put("createdAt", flag.getCreatedAt().toString());

            Map<String, Object> report = new LinkedHashMap<>();
            report.put("reportId", flag.getReport().getReportId().toString());
            report.put("childName", flag.getReport().getChildName());
            report.put("age", flag.getReport().getAge());
            report.put("gender", flag.getReport().getGender());
            report.put("lastSeenLocation", flag.getReport().getLastSeenLocation());
            report.put("status", flag.getReport().getStatus());
            item.put("report", report);

            Map<String, Object> matched = new LinkedHashMap<>();
            matched.put("reportId", flag.getMatchedReport().getReportId().toString());
            matched.put("childName", flag.getMatchedReport().getChildName());
            matched.put("age", flag.getMatchedReport().getAge());
            matched.put("gender", flag.getMatchedReport().getGender());
            matched.put("lastSeenLocation", flag.getMatchedReport().getLastSeenLocation());
            matched.put("status", flag.getMatchedReport().getStatus());
            item.put("matchedReport", matched);

            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // PUT /api/admin/duplicate-flags/{flagId}/dismiss — dismiss a duplicate flag
    @PutMapping("/duplicate-flags/{flagId}/dismiss")
    public ResponseEntity<?> dismissFlag(@PathVariable String flagId) {
        Optional<DuplicateFlag> flagOpt = duplicateFlagRepository.findById(UUID.fromString(flagId));
        if (flagOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        DuplicateFlag flag = flagOpt.get();
        flag.setReviewed(true);
        duplicateFlagRepository.save(flag);
        return ResponseEntity.ok(Map.of("message", "Flag dismissed successfully"));
    }

    // PUT /api/admin/duplicate-flags/{flagId}/merge — mark new report as duplicate
    @PutMapping("/duplicate-flags/{flagId}/merge")
    public ResponseEntity<?> mergeFlag(@PathVariable String flagId) {
        Optional<DuplicateFlag> flagOpt = duplicateFlagRepository.findById(UUID.fromString(flagId));
        if (flagOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        DuplicateFlag flag = flagOpt.get();

        // Mark the new report as duplicate
        Report report = flag.getReport();
        report.setStatus("duplicate");
        reportRepository.save(report);

        // Mark the flag as reviewed
        flag.setReviewed(true);
        duplicateFlagRepository.save(flag);

        return ResponseEntity.ok(Map.of("message", "Report marked as duplicate successfully"));
    }

    // PUT /api/admin/reports/{reportId}/status — update report status
    @PutMapping("/reports/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable String reportId,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        if (newStatus == null || (!newStatus.equals("active") &&
            !newStatus.equals("found") && !newStatus.equals("duplicate"))) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Status must be: active, found, or duplicate"));
        }

        Optional<Report> reportOpt = reportRepository.findById(UUID.fromString(reportId));
        if (reportOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Report report = reportOpt.get();
        report.setStatus(newStatus);
        reportRepository.save(report);

        return ResponseEntity.ok(Map.of(
            "message", "Report status updated to " + newStatus,
            "reportId", reportId
        ));
    }
}
