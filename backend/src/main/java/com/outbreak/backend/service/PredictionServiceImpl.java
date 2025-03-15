package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.District;
import com.outbreak.backend.model.WeatherData;
import com.outbreak.backend.payload.PredictionResponseDTO;
import com.outbreak.backend.payload.WeatherDataDTO;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.repositories.PredictionRepository;
import com.outbreak.backend.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService{

    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    PredictionRepository predictionRepository;
    @Autowired
    AuthUtil authUtil;

    @Override
    public WeatherDataDTO saveWeatherData(WeatherDataDTO weatherFactorsDTO, Long districtId) {

        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId", districtId));

        try {
            WeatherData weatherData = modelMapper.map(weatherFactorsDTO, WeatherData.class);
            weatherData.setDistrict(district);
            predictionRepository.save(weatherData);

            return modelMapper.map(weatherData, WeatherDataDTO.class);
        }catch (DataIntegrityViolationException e){
            throw new APIException("Weather data already exists for this month, week, and year!");
        }


    }

    @Override
    public PredictionResponseDTO getSystemAutoPrediction() {

        District district = authUtil.loggedInDistrict();

        // Fetch latest weather data for the district
        WeatherData latestWeatherData = predictionRepository.findLatestWeatherDataByDistrict(district)
                .orElseThrow(() -> new APIException("No weather data found for the district"));


        // Call FastAPI prediction model
        PredictionResponseDTO predictionResponse = callFastAPIPrediction(latestWeatherData, district.getDistrictName());

        return predictionResponse;

    }

    public PredictionResponseDTO callFastAPIPrediction(WeatherData weatherData, String districtName){

        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "http://0.0.0.0:8000/predict/";

        // Create request body with the formatted district name
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("district", districtName);
        requestBody.put("month", weatherData.getPredictMonth());
        requestBody.put("year", weatherData.getPredictYear());
        requestBody.put("week", weatherData.getPredictWeek());
        requestBody.put("max_temp", weatherData.getAvgMaxTemp());
        requestBody.put("min_temp", weatherData.getAvgMinTemp());
        requestBody.put("rain", weatherData.getTotalPrecipitation());
        requestBody.put("wind", weatherData.getAvgWindSpeed());
        requestBody.put("gust", weatherData.getMaxWindGusts());
        requestBody.put("weather_code", weatherData.getWeatherCode());

        // Make HTTP request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<PredictionResponseDTO> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                request,
                PredictionResponseDTO.class
        );

        return response.getBody();

    }

    @Override
    public PredictionResponseDTO getPrediction(WeatherDataDTO weatherDataDTO, Long districtId) {

        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId", districtId));


        WeatherData weatherData = modelMapper.map(weatherDataDTO, WeatherData.class);

        return callFastAPIPrediction(weatherData, district.getDistrictName());

    }


}
