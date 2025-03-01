package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.DivisionDTO;
import com.outbreak.backend.payload.DivisionResponse;
import com.outbreak.backend.service.DivisionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DivisionController {

    @Autowired
    DivisionService divisionService;

    @GetMapping("/public/division")
    public ResponseEntity<List<DivisionDTO>> getAllDivisions(){
        List<DivisionDTO> divisionDTOS = divisionService.getAllDivisions();
        return new ResponseEntity<>(divisionDTOS,HttpStatus.OK);
    }

    @GetMapping("/public/division/value/{input}")
    public ResponseEntity<DivisionResponse> getDivisionByDivisionNameOrId(@PathVariable String input,
                                                              @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                              @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                              @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_DIVISIONS_BY, required = false) String sortBy,
                                                              @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){

        DivisionResponse divisionResponse = divisionService.searchDivisionByIdOrDivisionName(input, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(divisionResponse, HttpStatus.FOUND);



    }


    @PostMapping("/admin/division")
    public ResponseEntity<DivisionDTO> createDivision(@Valid @RequestBody DivisionDTO divisionDTO){

        DivisionDTO savedDivisionDTO = divisionService.createDivision(divisionDTO);
        return new ResponseEntity<>(savedDivisionDTO, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/division/{divisionId}")
    public ResponseEntity<DivisionDTO> deleteDivision(@PathVariable Long divisionId){

        DivisionDTO deleteDivisionDTO = divisionService.deleteDivision(divisionId);
        return new ResponseEntity<>(deleteDivisionDTO, HttpStatus.OK);

    }

    @PutMapping("/admin/division/{divisionId}")
    public ResponseEntity<DivisionDTO> updateDivision(@Valid @RequestBody DivisionDTO divisionDTO, @PathVariable Long divisionId){

        DivisionDTO savedDivisionDTO = divisionService.updateDivision(divisionDTO,divisionId);
        return new ResponseEntity<>(savedDivisionDTO,HttpStatus.OK);

    }


}
