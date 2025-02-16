package com.outbreak.backend.controller;

import com.outbreak.backend.payload.CaseDataDTO;
import com.outbreak.backend.service.DengueCaseDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DengueCaseDataController {

    @Autowired
    DengueCaseDataService dengueCaseDataService;

    @PostMapping("/public/caseData/{districtId}")
    public ResponseEntity<CaseDataDTO> addCaseDataYear(@Valid @RequestBody CaseDataDTO caseDataDTO, @PathVariable Long districtId){

        CaseDataDTO savedCaseDataDTO = dengueCaseDataService.addCaseData(caseDataDTO,districtId);
        return new ResponseEntity<>(savedCaseDataDTO, HttpStatus.CREATED);

    }

    @GetMapping("/public/caseData")
    public ResponseEntity<List<CaseDataDTO>> getAllCaseData(){
        List<CaseDataDTO> caseDataDTOList = dengueCaseDataService.getAllCaseData();
        return new ResponseEntity<>(caseDataDTOList, HttpStatus.OK);
    }

    @PutMapping("/admin/caseData/{caseId}")
    public ResponseEntity<CaseDataDTO> updateCaseData(@Valid @RequestBody CaseDataDTO caseDataDTO, @PathVariable Long caseId){

        CaseDataDTO savedCaseDataDTO = dengueCaseDataService.updateCaseData(caseDataDTO,caseId);
        return new ResponseEntity<>(savedCaseDataDTO,HttpStatus.OK);

    }

    @DeleteMapping("/admin/caseData/{caseId}")
    public ResponseEntity<CaseDataDTO> deleteCaseData(@PathVariable Long caseId){

        CaseDataDTO deletedCaseDataDTO = dengueCaseDataService.deleteCaseData(caseId);
        return new ResponseEntity<>(deletedCaseDataDTO, HttpStatus.OK);

    }
}
