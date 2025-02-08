package com.outbreak.backend.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.outbreak.backend.model.District;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponseDTO {
    @JsonProperty("predicted_cases") // Maps JSON "predicted_cases" -> Java "predictedCases"
    private Double predictedCases;
}
