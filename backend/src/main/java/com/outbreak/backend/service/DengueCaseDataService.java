package com.outbreak.backend.service;

import com.outbreak.backend.payload.CaseDataDTO;

import java.util.List;

public interface DengueCaseDataService {
    CaseDataDTO addCaseData(CaseDataDTO caseDataDTO, Long districtId);

    List<CaseDataDTO> getAllCaseData();

    CaseDataDTO updateCaseData(CaseDataDTO caseDataDTO, Long caseId);

    CaseDataDTO deleteCaseData(Long caseId);
}
