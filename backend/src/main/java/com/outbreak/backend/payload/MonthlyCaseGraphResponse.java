package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyCaseGraphResponse {
    private Long graphDataId;
    private String caseMonth;
    private Integer caseYear;
    private Integer numberOfCases;
}
