package com.outbreak.backend.controller;

import com.outbreak.backend.payload.DistrictTotalCasesResponse;
import com.outbreak.backend.payload.GraphDataDTO;
import com.outbreak.backend.payload.MonthlyCaseGraphResponse;
import com.outbreak.backend.payload.WeeklyCasesResponse;
import com.outbreak.backend.service.GraphDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<GraphDataDTO> addGraphData(@Valid @RequestBody GraphDataDTO graphDataDTO){

        GraphDataDTO savedGraphData = graphDataService.addGraphData(graphDataDTO);
        return new ResponseEntity<>(savedGraphData, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/graph/{graphDataId}")
    public ResponseEntity<GraphDataDTO> deleteGraphData(@PathVariable Long graphDataId){

        GraphDataDTO deletedGraphData = graphDataService.deleteGraphData(graphDataId);
        return new ResponseEntity<>(deletedGraphData, HttpStatus.OK);

    }

    @PutMapping("/admin/graph/{graphDataId}")
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

}
