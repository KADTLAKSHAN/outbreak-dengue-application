package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphDataDTO {
    private Long graphDataId;
    private Integer numberOfCases;
    private Integer caseMonth;
    private Integer caseYear;
    private Integer caseWeek;
    private Long districtId;
}
