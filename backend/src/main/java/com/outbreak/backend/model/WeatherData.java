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
    private Integer totalPrecipitation;
    private Integer avgWindSpeed;
    private Integer maxWindGusts;
    private Integer weatherCode;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;


}
