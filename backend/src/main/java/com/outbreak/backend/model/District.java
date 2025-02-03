package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long districtId;
    private String districtName;
    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL)
    private List<Division> divisions;

    public District(String districtName) {
        this.districtName = districtName;
    }
}
