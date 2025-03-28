package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.DistrictDTO;
import com.outbreak.backend.payload.DistrictResponse;
import com.outbreak.backend.service.DistrictService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class DistrictController {

    @Autowired
    DistrictService districtService;

    @GetMapping("/public/district")
    public ResponseEntity<DistrictResponse> getAllDistrict(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_DISTRICTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        DistrictResponse districtResponse = districtService.getAllDistrict(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(districtResponse, HttpStatus.OK);
    }

    @GetMapping("/public/district/value/{input}")
    public ResponseEntity<DistrictResponse> getDistrictByDistrictNameOrId(@PathVariable String input,
                                                                          @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                                          @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                                          @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_DISTRICTS_BY, required = false) String sortBy,
                                                                          @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){

        DistrictResponse districtResponse = districtService.searchDistrictByIdOrDistrictName(input, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(districtResponse, HttpStatus.FOUND);



    }


    @PostMapping("/admin/district")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DistrictDTO> createDistrict(@Valid @RequestBody DistrictDTO districtDTO){

        DistrictDTO savedDistrictDTO = districtService.createDistrict(districtDTO);
        return new ResponseEntity<>(savedDistrictDTO, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/district/{districtId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DistrictDTO> deleteDistrict(@PathVariable Long districtId){

        DistrictDTO deleteDistrictDTO = districtService.deleteDistrict(districtId);
        return new ResponseEntity<>(deleteDistrictDTO, HttpStatus.OK);

    }

    @PutMapping("/admin/district/{districtId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DistrictDTO> updateDistrict(@Valid @RequestBody DistrictDTO districtDTO, @PathVariable Long districtId){

        DistrictDTO savedDistrictDTO = districtService.updateDistrict(districtDTO,districtId);
        return new ResponseEntity<>(savedDistrictDTO,HttpStatus.OK);

    }

}
