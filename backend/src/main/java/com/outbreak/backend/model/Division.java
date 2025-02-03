package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Division {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long divisionId;

    private String divisionName;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    public Division(String divisionName) {
        this.divisionName = divisionName;
    }
}
