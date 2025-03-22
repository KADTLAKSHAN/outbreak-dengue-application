package com.outbreak.backend.repositories;

import com.outbreak.backend.model.GraphData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraphDataRepository extends JpaRepository<GraphData,Long> {
    List<GraphData> findByDistrictDistrictId(Long districtId);

    List<GraphData> findByDistrictDistrictNameLikeIgnoreCase(String s);

    @Query("SELECT MAX(c.caseYear) FROM GraphData c")
    Integer findMaxYear();

    @Query("SELECT c.caseMonth, SUM(c.numberOfCases) FROM GraphData c WHERE c.caseYear = :latestYear GROUP BY c.caseMonth ORDER BY c.caseMonth")
    List<Object[]> getMonthlyCasesSummary(@Param("latestYear") Integer latestYear);
}
