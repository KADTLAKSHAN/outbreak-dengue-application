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

        // Format district name to match FastAPI input
        String formattedDistrictName = "District_" + district.getDistrictName();

        // Call FastAPI prediction model
        PredictionResponseDTO predictionResponse = callFastAPIPrediction(latestWeatherData, formattedDistrictName);

        return predictionResponse;

    }

    public PredictionResponseDTO callFastAPIPrediction(WeatherData weatherData, String formattedDistrictName){

        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "http://0.0.0.0:8000/predict/";

        // Create request body with the formatted district name
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("district", formattedDistrictName);
        requestBody.put("Month", weatherData.getPredictMonth());
        requestBody.put("Year", weatherData.getPredictYear());
        requestBody.put("Week", weatherData.getPredictWeek());
        requestBody.put("AvgMaxTemp", weatherData.getAvgMaxTemp());
        requestBody.put("AvgMinTemp", weatherData.getAvgMinTemp());
        requestBody.put("AvgApparentMaxTemp", weatherData.getAvgApparentMaxTemp());
        requestBody.put("AvgApparentMinTemp", weatherData.getAvgApparentMinTemp());
        requestBody.put("TotalPrecipitation", weatherData.getTotalPrecipitation());
        requestBody.put("AvgWindSpeed", weatherData.getAvgWindSpeed());
        requestBody.put("MaxWindGusts", weatherData.getMaxWindGusts());
        requestBody.put("WeatherCode", weatherData.getWeatherCode());
        requestBody.put("Cases_Last_Week", weatherData.getCases_Last_Week());
        requestBody.put("Cases_Last_2_Weeks", weatherData.getCases_Last_2_Weeks());
        requestBody.put("Cases_3_Week_Avg", weatherData.getCases_3_Week_Avg());
        requestBody.put("Cases_5_Week_Avg", weatherData.getCases_5_Week_Avg());
        requestBody.put("Cases_Diff_1_Week", weatherData.getCases_Diff_1_Week());

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
        return null;
    }


}
