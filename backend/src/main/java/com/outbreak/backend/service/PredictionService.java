package com.outbreak.backend.service;

import com.outbreak.backend.payload.PredictionResponseDTO;
import com.outbreak.backend.payload.WeatherDataDTO;

public interface PredictionService {
    WeatherDataDTO saveWeatherData(WeatherDataDTO weatherFactorsDTO, Long districtId);

    PredictionResponseDTO getSystemAutoPrediction();

    PredictionResponseDTO getPrediction(WeatherDataDTO weatherDataDTO, Long districtId);
}
