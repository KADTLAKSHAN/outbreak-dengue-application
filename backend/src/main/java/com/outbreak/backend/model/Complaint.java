package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintId;
    private String complaintType;
    @Column(length = 3000)
    private String complaintDetails;
    @Column(length = 3000)
    private String complaintReply;
    private LocalDate complaintDate;
    private Boolean status;
    private String complaintAgentUserName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
