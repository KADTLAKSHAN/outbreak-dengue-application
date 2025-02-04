package com.outbreak.backend.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private Long complaintId;
    private String complaintType;
    private String complaintDetails;
    private String complaintReply;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") // Ensures correct JSON format
    private LocalDate complaintDate;
    private String complaintAgentUserName;
    private Boolean status;
    private Long userId;
}
