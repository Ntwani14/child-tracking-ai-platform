package com.childtracking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Child name is required")
    private String childName;

    @NotNull(message = "Age is required")
    @Positive(message = "Age must be a positive number")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Physical description is required")
    private String physicalDescription;

    @NotBlank(message = "Last seen location is required")
    private String lastSeenLocation;

    @NotBlank(message = "Date last seen is required")
    private String dateLastSeen;
}
