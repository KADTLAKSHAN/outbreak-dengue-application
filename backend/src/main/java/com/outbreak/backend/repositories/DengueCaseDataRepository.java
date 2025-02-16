package com.outbreak.backend.repositories;

import com.outbreak.backend.model.CaseData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DengueCaseDataRepository extends JpaRepository<CaseData, Long> {
}
