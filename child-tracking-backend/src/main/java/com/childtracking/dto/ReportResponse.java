package com.childtracking.dto;

import lombok.Data;

@Data
public class ReportResponse {
    private String reportId;
    private String childName;
    private Integer age;
    private String gender;
    private String physicalDescription;
    private String lastSeenLocation;
    private String dateLastSeen;
    private String imagePath;
    private String status;
    private String submittedBy;
    private String createdAt;
}
