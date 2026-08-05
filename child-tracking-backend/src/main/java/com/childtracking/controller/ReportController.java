package com.childtracking.controller;

import com.childtracking.dto.ReportRequest;
import com.childtracking.dto.ReportResponse;
import com.childtracking.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // POST /api/reports — submit a new report
    @PostMapping
    public ResponseEntity<?> submitReport(
            @Valid @RequestBody ReportRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReportResponse response = reportService.submitReport(request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/reports — get all active reports, with optional filters
    @GetMapping
    public ResponseEntity<List<ReportResponse>> getReports(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location) {

        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(reportService.searchByName(name));
        }
        if (location != null && !location.isBlank()) {
            return ResponseEntity.ok(reportService.searchByLocation(location));
        }
        return ResponseEntity.ok(reportService.getAllActiveReports());
    }

    // GET /api/reports/{id} — get a specific report by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(reportService.getReportById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
