package com.childtracking.controller;

import com.childtracking.repository.ReportRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ReportRepository reportRepository;

    public AnalyticsController(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getTrends() {
        var allReports = reportRepository.findAll();

        // Total counts by status
        long totalActive = allReports.stream().filter(r -> "active".equals(r.getStatus())).count();
        long totalFound = allReports.stream().filter(r -> "found".equals(r.getStatus())).count();
        long totalDuplicate = allReports.stream().filter(r -> "duplicate".equals(r.getStatus())).count();

        // Reports by location (top locations)
        Map<String, Long> byLocation = allReports.stream()
            .collect(Collectors.groupingBy(
                r -> r.getLastSeenLocation().split(",")[0].trim(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10)
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));

        // Reports by month
        Map<String, Long> byMonth = allReports.stream()
            .collect(Collectors.groupingBy(
                r -> r.getCreatedAt().getYear() + "-" +
                     String.format("%02d", r.getCreatedAt().getMonthValue()),
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));

        // Gender breakdown
        Map<String, Long> byGender = allReports.stream()
            .collect(Collectors.groupingBy(
                r -> r.getGender() != null ? r.getGender() : "Unknown",
                Collectors.counting()
            ));

        // Age group breakdown
        Map<String, Long> byAgeGroup = new LinkedHashMap<>();
        byAgeGroup.put("0-5", allReports.stream().filter(r -> r.getAge() != null && r.getAge() <= 5).count());
        byAgeGroup.put("6-10", allReports.stream().filter(r -> r.getAge() != null && r.getAge() >= 6 && r.getAge() <= 10).count());
        byAgeGroup.put("11-14", allReports.stream().filter(r -> r.getAge() != null && r.getAge() >= 11 && r.getAge() <= 14).count());
        byAgeGroup.put("15-18", allReports.stream().filter(r -> r.getAge() != null && r.getAge() >= 15 && r.getAge() <= 18).count());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalReports", allReports.size());
        result.put("totalActive", totalActive);
        result.put("totalFound", totalFound);
        result.put("totalDuplicate", totalDuplicate);
        result.put("byLocation", byLocation);
        result.put("byMonth", byMonth);
        result.put("byGender", byGender);
        result.put("byAgeGroup", byAgeGroup);

        return ResponseEntity.ok(result);
    }
}
