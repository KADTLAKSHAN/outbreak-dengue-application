package com.outbreak.backend.service;

import com.outbreak.backend.payload.DivisionDTO;
import com.outbreak.backend.payload.DivisionResponse;

public interface DivisionService {
    DivisionDTO createDivision(DivisionDTO divisionDTO);

    DivisionResponse getAllDivisions(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    DivisionDTO deleteDivision(Long divisionId);

    DivisionDTO updateDivision(DivisionDTO divisionDTO, Long divisionId);

    DivisionResponse searchDivisionByIdOrDivisionName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
