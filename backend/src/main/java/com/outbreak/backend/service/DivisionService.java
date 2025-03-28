package com.outbreak.backend.service;

import com.outbreak.backend.payload.DivisionDTO;
import com.outbreak.backend.payload.DivisionResponse;

import java.util.List;

public interface DivisionService {
    DivisionDTO createDivision(DivisionDTO divisionDTO);

    List<DivisionDTO> getAllDivisions();

    DivisionDTO deleteDivision(Long divisionId);

    DivisionDTO updateDivision(DivisionDTO divisionDTO, Long divisionId);

    DivisionResponse searchDivisionByIdOrDivisionName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    DivisionResponse getAllDivisionsWithPagination(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    List<DivisionDTO> getAllDivisionsByDistrict(Long districtId);
}
