package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.Alert;
import com.outbreak.backend.model.CaseData;
import com.outbreak.backend.model.District;
import com.outbreak.backend.payload.AlertDTO;
import com.outbreak.backend.payload.CaseDataDTO;
import com.outbreak.backend.repositories.DengueCaseDataRepository;
import com.outbreak.backend.repositories.DistrictRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DengueCaseDataServiceImpl implements DengueCaseDataService{

    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    DengueCaseDataRepository dengueCaseDataRepository;

    @Override
    public CaseDataDTO addCaseData(CaseDataDTO caseDataDTO, Long districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",districtId));

        CaseData caseData = modelMapper.map(caseDataDTO, CaseData.class);
        caseData.setDistrict(district);
        dengueCaseDataRepository.save(caseData);
        return modelMapper.map(caseData, CaseDataDTO.class);
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
