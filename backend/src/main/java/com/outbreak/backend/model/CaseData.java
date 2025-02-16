package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "case_data",
        uniqueConstraints = @UniqueConstraint(columnNames = {"districtId", "caseYear", "caseMonth"}))
public class CaseData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseId;

    @OneToOne
    @JoinColumn(name = "districtId")
    private District district;

    private Integer caseYear;
    private String caseMonth;
    private Integer noCases;

}
