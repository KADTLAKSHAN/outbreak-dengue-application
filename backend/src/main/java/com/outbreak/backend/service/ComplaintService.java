package com.outbreak.backend.service;

import com.outbreak.backend.payload.ComplaintDTO;
import com.outbreak.backend.payload.ComplaintResponse;

public interface ComplaintService {
    ComplaintDTO createComplaint(ComplaintDTO complaintDTO);

    ComplaintDTO deleteComplaint(Long complaintId);

    ComplaintResponse getAllComplaints(Integer pageNumber, Integer pageSize);

    ComplaintDTO replyComplaint(ComplaintDTO complaintDTO, Long complaintId);

    ComplaintResponse getUserComplaints(Integer pageNumber, Integer pageSize);
}
