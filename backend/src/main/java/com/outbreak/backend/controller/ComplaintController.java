package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.ComplaintDTO;
import com.outbreak.backend.payload.ComplaintResponse;
import com.outbreak.backend.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ComplaintController {

    @Autowired
    ComplaintService complaintService;

    @PostMapping("/public/complaints")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PUBLIC_USER')")
    public ResponseEntity<ComplaintDTO> createComplaint(@Valid @RequestBody ComplaintDTO complaintDTO){

        ComplaintDTO savedComplaintDTO = complaintService.createComplaint(complaintDTO);
        return new ResponseEntity<>(savedComplaintDTO, HttpStatus.CREATED);

    }

    @DeleteMapping("/public/complaints/{complaintId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ComplaintDTO> deleteComplaintId(@PathVariable Long complaintId){

        ComplaintDTO deleteComplaintDTO = complaintService.deleteComplaint(complaintId);
        return new ResponseEntity<>(deleteComplaintDTO, HttpStatus.OK);

    }

    @GetMapping("/public/complaints")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MOH_USER', 'ROLE_PUBLIC_USER')")
    public ResponseEntity<ComplaintResponse> getAllComplaints(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize){
        ComplaintResponse complaintResponse = complaintService.getAllComplaints(pageNumber, pageSize);
        return new ResponseEntity<>(complaintResponse, HttpStatus.OK);
    }

    @PutMapping("/public/complaints/{complaintId}")
    @PreAuthorize("hasRole('ROLE_MOH_USER')")
    public ResponseEntity<ComplaintDTO> replyComplaint(@Valid @RequestBody ComplaintDTO complaintDTO, @PathVariable Long complaintId){

        ComplaintDTO savedComplaintDTO = complaintService.replyComplaint(complaintDTO,complaintId);
        return new ResponseEntity<>(savedComplaintDTO,HttpStatus.OK);

    }

    @GetMapping("public/complaints/user")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MOH_USER', 'ROLE_PUBLIC_USER')")
    public ResponseEntity<ComplaintResponse> getUserComplaints(@RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                               @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize){
        ComplaintResponse complaintResponse = complaintService.getUserComplaints(pageNumber, pageSize);
        return new ResponseEntity<>(complaintResponse, HttpStatus.OK);
    }

}
