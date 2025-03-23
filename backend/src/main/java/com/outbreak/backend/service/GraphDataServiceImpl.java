package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.District;
import com.outbreak.backend.model.GraphData;
import com.outbreak.backend.payload.DistrictTotalCasesResponse;
import com.outbreak.backend.payload.GraphDataDTO;
import com.outbreak.backend.payload.MonthlyCaseGraphResponse;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.repositories.GraphDataRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GraphDataServiceImpl implements GraphDataService{

    @Autowired
    GraphDataRepository graphDataRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    DistrictRepository districtRepository;

    @Override
    public List<GraphDataDTO> getAllGraphData() {
        List<GraphData> graphDataList = graphDataRepository.findAll();

        if(graphDataList.isEmpty())
            throw new APIException("Graph data not exists");

        List<GraphDataDTO> graphDataDTOList = graphDataList.stream()
                .map(graphData -> modelMapper.map(graphData, GraphDataDTO.class))
                .toList();

        return graphDataDTOList;
    }

    @Override
    public List<GraphDataDTO> searchGraphDataByIdOrDistrictName(String input) {
        // First, check if the input is a numeric districtId
        List<GraphData> graphDataList;
        try {
            Long districtId = Long.parseLong(input);
            // Find GraphData by districtId
            graphDataList = graphDataRepository.findByDistrictDistrictId(districtId);
        } catch (NumberFormatException e) {
            // If not numeric, treat it as a district name search
            graphDataList = graphDataRepository.findByDistrictDistrictNameLikeIgnoreCase("%" + input + "%");
        }

        if (graphDataList.isEmpty()) {
            throw new APIException("GraphData not found for district: " + input);
        }

        // Convert GraphData entities to DTOs
        List<GraphDataDTO> graphDataDTOList = graphDataList.stream()
                .map(graphData -> modelMapper.map(graphData, GraphDataDTO.class))
                .collect(Collectors.toList());

        return graphDataDTOList;
    }

    @Override
    public GraphDataDTO addGraphData(GraphDataDTO graphDataDTO) {
        District district = districtRepository.findById(graphDataDTO.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",graphDataDTO.getDistrictId()));

        GraphData graphData = modelMapper.map(graphDataDTO, GraphData.class);
        graphData.setDistrict(district);
        graphData.setDistrictName(district.getDistrictName());
        graphDataRepository.save(graphData);
        return modelMapper.map(graphData, GraphDataDTO.class);
    }

    @Override
    public GraphDataDTO deleteGraphData(Long graphDataId) {
        GraphData graphData = graphDataRepository.findById(graphDataId)
                .orElseThrow(() -> new ResourceNotFoundException("GraphData", "graphDataId", graphDataId));

        graphDataRepository.delete(graphData);
        return modelMapper.map(graphData, GraphDataDTO.class);
    }

    @Override
    public GraphDataDTO updateGraphData(GraphDataDTO graphDataDTO, Long graphDataId) {
        GraphData graphDataFromDB = graphDataRepository.findById(graphDataId)
                .orElseThrow(() -> new ResourceNotFoundException("GraphData", "graphDataId", graphDataId));

        District district = districtRepository.findById(graphDataDTO.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId",graphDataDTO.getDistrictId()));

        GraphData graphData = modelMapper.map(graphDataDTO, GraphData.class);
        graphData.setGraphDataId(graphDataId);
        graphDataFromDB.setDistrict(district);
        graphDataFromDB = graphDataRepository.save(graphData);
        return modelMapper.map(graphDataFromDB, GraphDataDTO.class);
    }

    @Override
    public List<MonthlyCaseGraphResponse> getMonthlyCasesForLatestYear() {
        // Step 1: Find the latest year in the database
        Integer latestYear = graphDataRepository.findMaxYear();
        if (latestYear == null) {
            throw new APIException("No data available.");
        }

        // Step 2: Fetch and aggregate dengue cases for the latest year
        List<Object[]> monthlyCases = graphDataRepository.getMonthlyCasesSummary(latestYear);

        // Step 3: Prepare month mapping
        Map<Integer, String> monthMap = new HashMap<>();
        monthMap.put(1, "January");
        monthMap.put(2, "February");
        monthMap.put(3, "March");
        monthMap.put(4, "April");
        monthMap.put(5, "May");
        monthMap.put(6, "June");
        monthMap.put(7, "July");
        monthMap.put(8, "August");
        monthMap.put(9, "September");
        monthMap.put(10, "October");
        monthMap.put(11, "November");
        monthMap.put(12, "December");

        // Step 4: Convert the aggregated data to DTO format
        List<MonthlyCaseGraphResponse> responseList = new ArrayList<>();
        long idCounter = 1;

        for (Object[] row : monthlyCases) {
            Integer month = (Integer) row[0]; // Extract month
            Integer totalCases = ((Number) row[1]).intValue(); // Extract total cases safely

            MonthlyCaseGraphResponse response = new MonthlyCaseGraphResponse(
                    idCounter++,             // graphDataId (auto-incremented)
                    monthMap.get(month),     // caseMonth (convert from number to name)
                    latestYear,              // caseYear (latest year)
                    totalCases               // numberOfCases (sum for the month)
            );

            responseList.add(response);
        }

        return responseList;

    }
    @Override
    public List<DistrictTotalCasesResponse> getDistrictTotalCasesForLatestYear() {
        // Step 1: Get the latest year
        Integer latestYear = graphDataRepository.findMaxYear();
        if (latestYear == null) {
            throw new APIException("No data available.");
        }

        // Step 2: Fetch total dengue cases for each district
        List<Object[]> results = graphDataRepository.getTotalCasesByDistrict(latestYear);

        // Step 3: Convert query result to DTO
        List<DistrictTotalCasesResponse> responseList = new ArrayList<>();
        long idCounter = 1; // Auto-incremented ID

        for (Object[] row : results) {
            String districtName = (String) row[0];     // District name
            Integer totalCases = ((Number) row[1]).intValue(); // Total cases

            responseList.add(new DistrictTotalCasesResponse(
                    idCounter++,  // Auto-incremented ID
                    districtName,
                    latestYear,
                    totalCases
            ));
        }

        return responseList;
    }
}
