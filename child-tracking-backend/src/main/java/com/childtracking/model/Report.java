package com.childtracking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "report_id", updatable = false, nullable = false)
    private UUID reportId;

    @Column(name = "child_name", nullable = false, length = 100)
    private String childName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 10)
    private String gender;

    @Column(name = "physical_description", nullable = false, columnDefinition = "TEXT")
    private String physicalDescription;

    @Column(name = "last_seen_location", nullable = false, length = 200)
    private String lastSeenLocation;

    @Column(name = "date_last_seen", nullable = false)
    private LocalDate dateLastSeen;

    @Column(name = "image_path", length = 255)
    private String imagePath;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "active";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
