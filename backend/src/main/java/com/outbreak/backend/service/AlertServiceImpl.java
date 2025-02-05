package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.Alert;
import com.outbreak.backend.model.District;
import com.outbreak.backend.payload.AlertDTO;
import com.outbreak.backend.payload.AlertResponse;
import com.outbreak.backend.repositories.AlertRepository;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertServiceImpl implements AlertService {

    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    AlertRepository alertRepository;
    @Autowired
    AuthUtil authUtil;

    @Override
    public AlertDTO createAlert(AlertDTO alertDTO, Long districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",districtId));

        Alert alert = modelMapper.map(alertDTO, Alert.class);
        alert.setDistrict(district);
        alertRepository.save(alert);
        return modelMapper.map(alert, AlertDTO.class);
    }

    @Override
    public AlertDTO deleteAlert(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "alertId", alertId));

        alertRepository.delete(alert);
        return modelMapper.map(alert, AlertDTO.class);
    }

    @Override
    public AlertResponse getAllAlert(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Alert> alertPage = alertRepository.findAll(pageDetails);

        List<Alert> alerts = alertPage.getContent();

        if(alerts.isEmpty())
            throw new APIException("Alerts not exists");

        List<AlertDTO> alertDTOS = alerts.stream()
                .map(alert -> modelMapper.map(alert, AlertDTO.class))
                .toList();

        AlertResponse alertResponse = new AlertResponse();
        alertResponse.setContent(alertDTOS);
        alertResponse.setPageNumber(alertPage.getNumber());
        alertResponse.setPageSize(alertPage.getSize());
        alertResponse.setTotalElements(alertPage.getTotalElements());
        alertResponse.setTotalpages(alertPage.getTotalPages());
        alertResponse.setLastPage(alertPage.isLast());

        return alertResponse;
    }

    @Override
    public AlertDTO updateAlert(AlertDTO alertDTO, Long alertId) {
        Alert alertFromDB = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "alertId", alertId));

        District district = districtRepository.findById(alertDTO.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",alertDTO.getDistrictId()));

        Alert alert = modelMapper.map(alertDTO, Alert.class);
        alert.setAlertId(alertId);
        alert.setDistrict(district);
        alertFromDB = alertRepository.save(alert);
        return modelMapper.map(alertFromDB, AlertDTO.class);

    }

    @Override
    public AlertResponse getDistrictAlerts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        District district = authUtil.loggedInDistrict();

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Alert> alertPage = alertRepository.findByDistrict(district, pageDetails);

        List<Alert> alerts = alertPage.getContent();

        if(alerts.isEmpty())
            throw new APIException("No alerts found for the specified district");

        List<AlertDTO> alertDTOS = alerts.stream()
                .map(alert -> modelMapper.map(alert, AlertDTO.class))
                .toList();

        AlertResponse alertResponse = new AlertResponse();
        alertResponse.setContent(alertDTOS);
        alertResponse.setPageNumber(alertPage.getNumber());
        alertResponse.setPageSize(alertPage.getSize());
        alertResponse.setTotalElements(alertPage.getTotalElements());
        alertResponse.setTotalpages(alertPage.getTotalPages());
        alertResponse.setLastPage(alertPage.isLast());

        return alertResponse;



    }

    @Override
    public AlertResponse searchAlertByDistrictIdOrDistrictName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Alert> alertPage;

        // Check if input is a valid districtId (numeric)
        try {
            Long districtId = Long.parseLong(input);
            alertPage = alertRepository.findByDistrict_DistrictId(districtId, pageDetails);
        } catch (NumberFormatException e) {
            // If not numeric, treat it as an alert name search
            alertPage = alertRepository.findByDistrict_DistrictNameContainingIgnoreCase(input, pageDetails);
        }

        List<Alert> alerts = alertPage.getContent();

        if(alerts.isEmpty())
            throw new APIException("Alerts/Alert not found with district value");

        List<AlertDTO> alertDTOS = alerts.stream()
                .map(alert -> modelMapper.map(alert, AlertDTO.class))
                .toList();

        AlertResponse alertResponse = new AlertResponse();
        alertResponse.setContent(alertDTOS);
        alertResponse.setPageNumber(alertPage.getNumber());
        alertResponse.setPageSize(alertPage.getSize());
        alertResponse.setTotalElements(alertPage.getTotalElements());
        alertResponse.setTotalpages(alertPage.getTotalPages());
        alertResponse.setLastPage(alertPage.isLast());
        return alertResponse;
    }
}
