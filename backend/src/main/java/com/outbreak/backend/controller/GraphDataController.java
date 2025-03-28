package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.*;
import com.outbreak.backend.service.GraphDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GraphDataController {

    @Autowired
    GraphDataService graphDataService;

    @GetMapping("/public/graph")
    public ResponseEntity<List<GraphDataDTO>> getAllGraphData(){
        List<GraphDataDTO> graphDataDTOS = graphDataService.getAllGraphData();
        return new ResponseEntity<>(graphDataDTOS, HttpStatus.OK);
    }

    @GetMapping("/public/graph/value/{input}")
    public ResponseEntity<List<GraphDataDTO>> getGraphDataByDistrictNameOrId(@PathVariable String input){

        List<GraphDataDTO> graphDataDTOS = graphDataService.searchGraphDataByIdOrDistrictName(input);
        return new ResponseEntity<>(graphDataDTOS, HttpStatus.FOUND);



    }


    @PostMapping("/admin/graph")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> addGraphData(@Valid @RequestBody GraphDataDTO graphDataDTO){

        GraphDataDTO savedGraphData = graphDataService.addGraphData(graphDataDTO);
        return new ResponseEntity<>(savedGraphData, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/graph/{graphDataId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> deleteGraphData(@PathVariable Long graphDataId){

        GraphDataDTO deletedGraphData = graphDataService.deleteGraphData(graphDataId);
        return new ResponseEntity<>(deletedGraphData, HttpStatus.OK);

    }

    @PutMapping("/admin/graph/{graphDataId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> updateGraphData(@Valid @RequestBody GraphDataDTO graphDataDTO, @PathVariable Long graphDataId){

        GraphDataDTO savedGraphData = graphDataService.updateGraphData(graphDataDTO,graphDataId);
        return new ResponseEntity<>(savedGraphData,HttpStatus.OK);

    }

    @GetMapping("/public/graph/monthly")
    public ResponseEntity<List<MonthlyCaseGraphResponse>> getGraphDataForLatestYear(){
        List<MonthlyCaseGraphResponse> monthlyCaseGraphResponses = graphDataService.getMonthlyCasesForLatestYear();
        return new ResponseEntity<>(monthlyCaseGraphResponses, HttpStatus.OK);
    }

    @GetMapping("/public/graph/district")
    public ResponseEntity<List<DistrictTotalCasesResponse>> getDistrictTotalCasesForLatestYear() {
        List<DistrictTotalCasesResponse> districtTotalCasesResponses = graphDataService.getDistrictTotalCasesForLatestYear();
        return new ResponseEntity<>(districtTotalCasesResponses, HttpStatus.OK);
    }

    @GetMapping("/public/graph/week")
    public ResponseEntity<List<WeeklyCasesResponse>> getWeeklyCasesForLatestYear() {
        List<WeeklyCasesResponse> weeklyCasesResponses = graphDataService.getWeeklyCasesForLatestYear();
        return new ResponseEntity<>(weeklyCasesResponses, HttpStatus.OK);
    }

    @GetMapping("/public/graph/year")
    public ResponseEntity<List<YearlyCasesResponse>> getYearlyCases() {
        List<YearlyCasesResponse> yearlyCasesResponses = graphDataService.getYearlyCases();
        return new ResponseEntity<>(yearlyCasesResponses, HttpStatus.OK);
    }

    @PostMapping("/admin/dataset")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> saveData(@Valid @RequestBody GraphDataDTO graphDataDTO){

        GraphDataDTO savedGraphDataDTO = graphDataService.saveData(graphDataDTO);
        return new ResponseEntity<>(savedGraphDataDTO, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/dataset/{graphDataId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> deleteData(@PathVariable Long graphDataId){

        GraphDataDTO deletedGraphDataDTO = graphDataService.deleteData(graphDataId);
        return new ResponseEntity<>(deletedGraphDataDTO, HttpStatus.OK);

    }

    @PutMapping("/admin/dataset/{graphDataId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GraphDataDTO> updateData(@Valid @RequestBody GraphDataDTO graphDataDTO, @PathVariable Long graphDataId){

        GraphDataDTO savedGraphDataDTO = graphDataService.updateData(graphDataDTO,graphDataId);
        return new ResponseEntity<>(savedGraphDataDTO,HttpStatus.OK);

    }

    @GetMapping("/public/dataset")
    public ResponseEntity<DatasetResponse> getAllData(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_DATASET_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        DatasetResponse datasetResponse = graphDataService.getAllData(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(datasetResponse, HttpStatus.OK);
    }

    @GetMapping("/public/dataset/district/{input}")
    public ResponseEntity<DatasetResponse> getDataByDistrictNameOrCaseYear(
            @PathVariable String input,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_DATASET_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        DatasetResponse datasetResponse = graphDataService.searchDataByDistrictNameOrCaseYear(input, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(datasetResponse, HttpStatus.OK);
    }

}
