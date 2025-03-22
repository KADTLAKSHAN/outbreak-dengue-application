package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long graphDataId;
    private String districtName;
    private Integer numberOfCases;
    private Integer caseMonth;
    private Integer caseYear;
    private Integer caseWeek;
    @ManyToOne
    @JoinColumn(name = "district_id", nullable = true)
    private District district;

}
