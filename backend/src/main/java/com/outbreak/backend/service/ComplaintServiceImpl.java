package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.Complaint;
import com.outbreak.backend.model.User;
import com.outbreak.backend.payload.ComplaintDTO;
import com.outbreak.backend.payload.ComplaintResponse;
import com.outbreak.backend.repositories.ComplaintRepository;
import com.outbreak.backend.util.AuthUtil;
import io.micrometer.common.util.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService{

    @Autowired
    AuthUtil authUtil;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    ComplaintRepository complaintRepository;

    @Override
    public ComplaintDTO createComplaint(ComplaintDTO complaintDTO) {
        User user = authUtil.loggedInUser();

        Complaint complaint = modelMapper.map(complaintDTO, Complaint.class);
        complaint.setUser(user);
        complaint.setStatus(false);
        complaint.setComplaintDate(LocalDate.now());
        Complaint savedComplaint = complaintRepository.save(complaint);
        return modelMapper.map(savedComplaint, ComplaintDTO.class);
    }

    @Override
    public ComplaintDTO deleteComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint","complaintId",complaintId));

        if(complaint.getStatus())
            throw new APIException("The complaint has already been replied to. You can't delete it now.");

        complaintRepository.delete(complaint);
        return modelMapper.map(complaint,ComplaintDTO.class);
    }

    @Override
    public ComplaintResponse getAllComplaints(Integer pageNumber, Integer pageSize) {

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize);

        // Fetch complaints with custom order
        Page<Complaint> complaintPage = complaintRepository.findAllByOrderByStatusAscComplaintDateDesc(pageDetails);

        List<Complaint> complaints = complaintPage.getContent();

        if(complaints.isEmpty())
            throw new APIException("Complaints not exists");

        List<ComplaintDTO> complaintDTOS = complaints.stream()
                .map(complaint -> modelMapper.map(complaint, ComplaintDTO.class))
                .toList();

        ComplaintResponse complaintResponse = new ComplaintResponse();
        complaintResponse.setContent(complaintDTOS);
        complaintResponse.setPageNumber(complaintPage.getNumber());
        complaintResponse.setPageSize(complaintPage.getSize());
        complaintResponse.setTotalElements(complaintPage.getTotalElements());
        complaintResponse.setTotalpages(complaintPage.getTotalPages());
        complaintResponse.setLastPage(complaintPage.isLast());

        return complaintResponse;
    }

    @Override
    public ComplaintDTO replyComplaint(ComplaintDTO complaintDTO, Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "complaintId", complaintId));

        // Check if the reply is null or empty
        if (StringUtils.isBlank(complaintDTO.getComplaintReply()))  // Best way
            throw new APIException("Reply can't be empty");

        if(!complaint.getStatus()){
            complaint.setComplaintReply(complaintDTO.getComplaintReply());
            complaint.setStatus(true);
            complaint.setComplaintAgentUserName(authUtil.loggedInUserName());
            complaintRepository.save(complaint);
            return modelMapper.map(complaint, ComplaintDTO.class);
        }else{
            throw new APIException("The complaint has already been replied to");
        }
    }

    @Override
    public ComplaintResponse getUserComplaints(Integer pageNumber, Integer pageSize) {

        User user = authUtil.loggedInUser();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize);

        // Fetch complaints with custom order
        Page<Complaint> complaintPage = complaintRepository.findByUserOrderByStatusAscComplaintDateDesc(user, pageDetails);

        List<Complaint> complaints = complaintPage.getContent();

        if(complaints.isEmpty())
            throw new APIException("Complaints not exists");

        List<ComplaintDTO> complaintDTOS = complaints.stream()
                .map(complaint -> modelMapper.map(complaint, ComplaintDTO.class))
                .toList();

        ComplaintResponse complaintResponse = new ComplaintResponse();
        complaintResponse.setContent(complaintDTOS);
        complaintResponse.setPageNumber(complaintPage.getNumber());
        complaintResponse.setPageSize(complaintPage.getSize());
        complaintResponse.setTotalElements(complaintPage.getTotalElements());
        complaintResponse.setTotalpages(complaintPage.getTotalPages());
        complaintResponse.setLastPage(complaintPage.isLast());

        return complaintResponse;
    }
}
