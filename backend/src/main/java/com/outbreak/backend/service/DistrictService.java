package com.outbreak.backend.service;

import com.outbreak.backend.payload.DistrictDTO;
import com.outbreak.backend.payload.DistrictResponse;

public interface DistrictService {
    DistrictResponse getAllDistrict(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    DistrictResponse searchDistrictByIdOrDistrictName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    DistrictDTO createDistrict(DistrictDTO districtDTO);

    DistrictDTO deleteDistrict(Long districtId);

    DistrictDTO updateDistrict(DistrictDTO districtDTO, Long districtId);
}
