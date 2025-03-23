package com.outbreak.backend.service;

import com.outbreak.backend.payload.*;

import java.util.List;

public interface GraphDataService {
    List<GraphDataDTO> getAllGraphData();

    List<GraphDataDTO> searchGraphDataByIdOrDistrictName(String input);

    GraphDataDTO addGraphData(GraphDataDTO graphDataDTO);

    GraphDataDTO deleteGraphData(Long graphDataId);

    GraphDataDTO updateGraphData(GraphDataDTO graphDataDTO, Long graphDataId);

    List<MonthlyCaseGraphResponse> getMonthlyCasesForLatestYear();

    List<DistrictTotalCasesResponse> getDistrictTotalCasesForLatestYear();

    List<WeeklyCasesResponse> getWeeklyCasesForLatestYear();

    List<YearlyCasesResponse> getYearlyCases();
}
