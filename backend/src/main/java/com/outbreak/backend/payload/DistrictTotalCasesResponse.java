package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistrictTotalCasesResponse {
    private Long graphDataId;
    private String districtName;
    private Integer caseYear;
    private Integer totalCases;
}
