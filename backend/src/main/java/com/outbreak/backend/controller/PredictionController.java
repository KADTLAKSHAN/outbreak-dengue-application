package com.outbreak.backend.controller;

import com.outbreak.backend.payload.PredictionResponseDTO;
import com.outbreak.backend.payload.WeatherDataDTO;
import com.outbreak.backend.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class PredictionController {

    @Autowired
    PredictionService predictionService;

    @PostMapping("/admin/prediction/{districtId}")
    public ResponseEntity<WeatherDataDTO> saveWeatherFactors(@Valid @RequestBody WeatherDataDTO weatherFactorsDTO, @PathVariable Long districtId){

        WeatherDataDTO savedWeatherData = predictionService.saveWeatherData(weatherFactorsDTO, districtId);
        return new ResponseEntity<>(savedWeatherData, HttpStatus.CREATED);

    }

    @GetMapping("/public/prediction/system")
    public ResponseEntity<PredictionResponseDTO> systemAutoPrediction(){

        PredictionResponseDTO predictionResponseDTO = predictionService.getSystemAutoPrediction();
        return new ResponseEntity<>(predictionResponseDTO, HttpStatus.OK);

    }

    @PostMapping("/public/prediction/{districtId}")
    public ResponseEntity<PredictionResponseDTO> getPrediction(@RequestBody WeatherDataDTO weatherDataDTO, @PathVariable Long districtId){

        PredictionResponseDTO predictionResponseDTO = predictionService.getPrediction(weatherDataDTO, districtId);
        return new ResponseEntity<>(predictionResponseDTO, HttpStatus.CREATED);

    }


}
