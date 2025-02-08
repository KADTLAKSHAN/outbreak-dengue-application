package com.outbreak.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "weather_data",
        uniqueConstraints = @UniqueConstraint(columnNames = {"predictMonth", "predictWeek", "predictYear"}))
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long weatherDataId;
    private Integer predictMonth;
    private Integer predictWeek;
    private Integer predictYear;
    private Integer avgMaxTemp;
    private Integer avgMinTemp;
    private Integer avgApparentMaxTemp;
    private Integer avgApparentMinTemp;
    private Integer totalPrecipitation;
    private Integer avgWindSpeed;
    private Integer maxWindGusts;
    private Integer weatherCode;
    private Integer cases_Last_Week;
    private Integer cases_Last_2_Weeks;
    private Double  cases_3_Week_Avg;
    private Double cases_5_Week_Avg;
    private Integer cases_Diff_1_Week;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;


}
