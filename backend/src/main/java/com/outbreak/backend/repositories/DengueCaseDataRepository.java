package com.outbreak.backend.repositories;

import com.outbreak.backend.model.CaseData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DengueCaseDataRepository extends JpaRepository<CaseData, Long> {

    Optional<CaseData> findByDistrict_DistrictIdAndCaseYearAndCaseMonth(Long districtId, Integer caseYear, String caseMonth);

    Boolean existsByDistrict_DistrictId(Long districtId);
}
