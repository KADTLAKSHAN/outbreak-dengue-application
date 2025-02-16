package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.exceptions.UniqueConstraintViolationException;
import com.outbreak.backend.model.Alert;
import com.outbreak.backend.model.CaseData;
import com.outbreak.backend.model.District;
import com.outbreak.backend.payload.AlertDTO;
import com.outbreak.backend.payload.CaseDataDTO;
import com.outbreak.backend.repositories.DengueCaseDataRepository;
import com.outbreak.backend.repositories.DistrictRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DengueCaseDataServiceImpl implements DengueCaseDataService{

    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    DengueCaseDataRepository dengueCaseDataRepository;

    @Transactional
    @Override
    public CaseDataDTO addCaseData(CaseDataDTO caseDataDTO, Long districtId) {

        try {

            District district = districtRepository.findById(districtId)
                    .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",districtId));

            // Check if a CaseData entry with the same district, caseYear, and caseMonth already exists
            Optional<CaseData> existingCaseData = dengueCaseDataRepository
                    .findByDistrict_DistrictIdAndCaseYearAndCaseMonth(districtId, caseDataDTO.getCaseYear(), caseDataDTO.getCaseMonth());

            if (existingCaseData.isPresent()) {
                throw new UniqueConstraintViolationException("A case with the same District, Case Year, and Case Month already exists.");
            }


            Boolean existDistrictInDatabase = dengueCaseDataRepository.existsByDistrict_DistrictId(districtId);

            if (existDistrictInDatabase) {
                throw new UniqueConstraintViolationException("A case with the same District already exists.");
            }


            CaseData caseData = modelMapper.map(caseDataDTO, CaseData.class);
            caseData.setDistrict(district);
            dengueCaseDataRepository.save(caseData);
            return modelMapper.map(caseData, CaseDataDTO.class);

        } catch (DataIntegrityViolationException e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                ConstraintViolationException constraintException = (ConstraintViolationException) e.getCause();
                // You can check constraint name or message depending on your database
                if (constraintException.getMessage().contains("districtId, caseYear, caseMonth")) {
                    throw new UniqueConstraintViolationException("The combination of District, Case Year, and Case Month must be unique.");
                }
            }
            // Handle other exceptions here
            throw e;
        }
    }

    @Override
    public List<CaseDataDTO> getAllCaseData() {

        List<CaseData> caseDataList = dengueCaseDataRepository.findAll();

        if(caseDataList.isEmpty())
            throw new APIException("Case data not exists");

        List<CaseDataDTO> caseDataDTOList = caseDataList.stream()
                .map(caseData -> modelMapper.map(caseData, CaseDataDTO.class))
                .toList();

        return caseDataDTOList;

    }

    @Override
    public CaseDataDTO updateCaseData(CaseDataDTO caseDataDTO, Long caseId) {
        CaseData caseDataFromDB = dengueCaseDataRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "caseId", caseId));

        District district = districtRepository.findByDistrictName(caseDataDTO.getDistrictName());
        if(district != null)
            throw new APIException("District with the name " + caseDataDTO.getDistrictName() + " already exists!!!");

        CaseData caseData = modelMapper.map(caseDataDTO, CaseData.class);
        caseData.setCaseId(caseId);
        caseData.setDistrict(district);
        caseDataFromDB = dengueCaseDataRepository.save(caseData);
        return modelMapper.map(caseDataFromDB, CaseDataDTO.class);
    }

    @Override
    public CaseDataDTO deleteCaseData(Long caseId) {
        CaseData caseData = dengueCaseDataRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "caseId", caseId));

        dengueCaseDataRepository.delete(caseData);
        return modelMapper.map(caseData, CaseDataDTO.class);
    }
}
