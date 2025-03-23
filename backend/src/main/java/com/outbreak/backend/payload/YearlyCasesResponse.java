package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YearlyCasesResponse {
    private Long graphDataId;
    private Integer caseYear;
    private Integer numberOfCases;
}
