package com.childtracking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "duplicate_flags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "flag_id", updatable = false, nullable = false)
    private UUID flagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_report_id", nullable = false)
    private Report matchedReport;

    @Column(name = "similarity_score", nullable = false, precision = 4, scale = 3)
    private BigDecimal similarityScore;

    @Column(name = "reviewed", nullable = false)
    private Boolean reviewed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
