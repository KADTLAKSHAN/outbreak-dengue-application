package com.outbreak.backend.payload;

import com.outbreak.backend.model.District;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDataDTO {
    private Long caseId;
    private String districtName;
    private String caseYear;
    private String caseMonth;
    private Integer noCases;
}
