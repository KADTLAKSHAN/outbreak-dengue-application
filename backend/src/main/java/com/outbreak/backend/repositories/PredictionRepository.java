package com.outbreak.backend.repositories;

import com.outbreak.backend.model.District;
import com.outbreak.backend.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.district = :district ORDER BY w.predictYear DESC, w.predictMonth DESC, w.predictWeek DESC LIMIT 1")
    Optional<WeatherData> findLatestWeatherDataByDistrict(District district);
}
