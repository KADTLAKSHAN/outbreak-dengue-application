package com.outbreak.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDataDTO {
    private Long weatherDataId;
    private Integer predictMonth;
    private Integer predictWeek;
    private Integer predictYear;
    private Integer avgMaxTemp;
    private Integer avgMinTemp;
    private Integer totalPrecipitation;
    private Integer avgWindSpeed;
    private Integer maxWindGusts;
    private Integer weatherCode;
}
