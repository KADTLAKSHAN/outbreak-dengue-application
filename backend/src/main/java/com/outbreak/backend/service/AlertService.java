package com.outbreak.backend.service;

import com.outbreak.backend.payload.AlertDTO;
import com.outbreak.backend.payload.AlertResponse;

public interface AlertService {
    AlertDTO createAlert(AlertDTO alertDTO, Long districtId);

    AlertDTO deleteAlert(Long alertId);

    AlertResponse getAllAlert(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    AlertDTO updateAlert(AlertDTO alertDTO, Long alertId);

    AlertResponse getDistrictAlerts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    AlertResponse searchAlertByDistrictIdOrDistrictName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
