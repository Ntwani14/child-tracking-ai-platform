package com.childtracking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Child name is required")
    @Size(max = 100, message = "Child name must be 100 characters or fewer")
    private String childName;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 17, message = "This platform is for missing children (age 17 or under)")
    private Integer age;

    @NotBlank(message = "Gender is required")
    @Size(max = 10, message = "Gender must be 10 characters or fewer")
    private String gender;

    @NotBlank(message = "Physical description is required")
    @Size(max = 2000, message = "Physical description must be 2000 characters or fewer")
    private String physicalDescription;

    @NotBlank(message = "Last seen location is required")
    @Size(max = 200, message = "Last seen location must be 200 characters or fewer")
    private String lastSeenLocation;

    @NotBlank(message = "Date last seen is required")
    private String dateLastSeen;

    // Optional - set after image is uploaded separately
    @Size(max = 255, message = "Invalid image path")
    private String imagePath;
}