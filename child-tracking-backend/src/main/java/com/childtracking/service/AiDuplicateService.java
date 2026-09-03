package com.childtracking.service;

import com.childtracking.model.DuplicateFlag;
import com.childtracking.model.Report;
import com.childtracking.repository.DuplicateFlagRepository;
import com.childtracking.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class AiDuplicateService {

    private static final Logger logger = Logger.getLogger(AiDuplicateService.class.getName());

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final DuplicateFlagRepository duplicateFlagRepository;
    private final ReportRepository reportRepository;
    private final RestTemplate restTemplate;

    public AiDuplicateService(DuplicateFlagRepository duplicateFlagRepository,
                               ReportRepository reportRepository) {
        this.duplicateFlagRepository = duplicateFlagRepository;
        this.reportRepository = reportRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Calls the Python AI service to check if the submitted report is a duplicate.
     * If a duplicate is found, saves a DuplicateFlag record.
     * This runs automatically after every new report submission.
     */
    public void checkForDuplicate(Report report) {
        try {
            // Build request payload for the AI service
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("report_id", report.getReportId().toString());
            requestBody.put("child_name", report.getChildName());
            requestBody.put("physical_description", report.getPhysicalDescription());
            requestBody.put("last_seen_location", report.getLastSeenLocation());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Call Python AI service
            ResponseEntity<Map> response = restTemplate.postForEntity(
                aiServiceUrl + "/api/detect-duplicate",
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                boolean isDuplicate = (Boolean) result.get("is_duplicate");
                double score = ((Number) result.get("highest_score")).doubleValue();

                logger.info("AI duplicate check for report " + report.getReportId() +
                           ": score=" + score + ", isDuplicate=" + isDuplicate);

                if (isDuplicate) {
                    // Extract matched report details
                    Map<String, Object> match = (Map<String, Object>) result.get("match");
                    String matchedReportId = (String) match.get("matched_report_id");

                    Optional<Report> matchedReport = reportRepository.findById(
                        UUID.fromString(matchedReportId)
                    );

                    if (matchedReport.isPresent()) {
                        // Save duplicate flag to database
                        DuplicateFlag flag = new DuplicateFlag();
                        flag.setReport(report);
                        flag.setMatchedReport(matchedReport.get());
                        flag.setSimilarityScore(BigDecimal.valueOf(score));
                        flag.setReviewed(false);
                        duplicateFlagRepository.save(flag);

                        logger.info("Duplicate flag saved: report " + report.getReportId() +
                                   " matches " + matchedReportId + " with score " + score);
                    }
                }
            }

        } catch (Exception e) {
            // AI service unavailable — log and continue without blocking submission
            logger.warning("AI duplicate check failed for report " + report.getReportId() +
                          ": " + e.getMessage() + " — report saved without duplicate check");
        }
    }
}
