package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.*;
import com.outbreak.backend.service.AlertServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AlertController {

    @Autowired
    AlertServices alertServices;

    @PostMapping("/public/alerts/{districtId}")
    public ResponseEntity<AlertDTO> createAlert(@Valid @RequestBody AlertDTO alertDTO, @PathVariable Long districtId){

        AlertDTO savedAlertDTO = alertServices.createAlert(alertDTO,districtId);
        return new ResponseEntity<>(savedAlertDTO, HttpStatus.CREATED);

    }

    @DeleteMapping("/admin/alerts/{alertId}")
    public ResponseEntity<AlertDTO> deleteAlert(@PathVariable Long alertId){

        AlertDTO deletedAlertDTO = alertServices.deleteAlert(alertId);
        return new ResponseEntity<>(deletedAlertDTO, HttpStatus.OK);

    }

    @GetMapping("/public/alerts")
    public ResponseEntity<AlertResponse> getAllAlerts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ALERTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        AlertResponse alertResponse = alertServices.getAllAlert(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(alertResponse, HttpStatus.OK);
    }

    @GetMapping("/public/alerts/district")
    public ResponseEntity<AlertResponse> getDistrictAlerts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ALERTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        AlertResponse alertResponse = alertServices.getDistrictAlerts(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(alertResponse, HttpStatus.OK);
    }

    @GetMapping("/public/alerts/district/{input}")
    public ResponseEntity<AlertResponse> getDistrictAlertsByDistrictIdOrName(
            @PathVariable String input,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ALERTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        AlertResponse alertResponse = alertServices.searchAlertByDistrictIdOrDistrictName(input, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(alertResponse, HttpStatus.OK);
    }



    @PutMapping("/admin/alert/{alertId}")
    public ResponseEntity<AlertDTO> updateAlerts(@Valid @RequestBody AlertDTO alertDTO, @PathVariable Long alertId){

        AlertDTO savedAlertDTO = alertServices.updateAlert(alertDTO,alertId);
        return new ResponseEntity<>(savedAlertDTO,HttpStatus.OK);

    }


}
