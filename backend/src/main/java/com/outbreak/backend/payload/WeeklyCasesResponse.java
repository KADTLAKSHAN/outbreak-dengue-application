package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyCasesResponse {
    private Long graphDataId;
    private Integer caseWeek;
    private Integer caseYear;
    private Integer numberOfCases;
}
