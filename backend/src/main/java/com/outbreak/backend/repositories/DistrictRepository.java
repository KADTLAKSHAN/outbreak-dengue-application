package com.outbreak.backend.repositories;

import com.outbreak.backend.model.District;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepository extends JpaRepository<District,Long> {
    boolean existsByDistrictName(String colombo);

    District findByDistrictName(String colombo);

    Page<District> findByDistrictIdOrDistrictNameLikeIgnoreCase(Long districtId, String s, Pageable pageDetails);

    Page<District> findByDistrictNameLikeIgnoreCase(String s, Pageable pageDetails);
}
