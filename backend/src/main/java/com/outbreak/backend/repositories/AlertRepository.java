package com.outbreak.backend.repositories;

import com.outbreak.backend.model.Alert;
import com.outbreak.backend.model.District;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert,Long> {
    Page<Alert> findByDistrict(District district, Pageable pageDetails);

    List<Alert> findByDistrict(District district);

    // Search by District ID
    Page<Alert> findByDistrict_DistrictId(Long districtId, Pageable pageable);

    // Search by District Name (Case Insensitive)
    Page<Alert> findByDistrict_DistrictNameContainingIgnoreCase(String districtName, Pageable pageable);
}
