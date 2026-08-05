package com.childtracking.repository;

import com.childtracking.model.DuplicateFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DuplicateFlagRepository extends JpaRepository<DuplicateFlag, UUID> {
    List<DuplicateFlag> findByReviewed(boolean reviewed);
}
