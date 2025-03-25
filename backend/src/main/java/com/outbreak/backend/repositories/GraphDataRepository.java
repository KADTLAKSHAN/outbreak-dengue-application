package com.outbreak.backend.repositories;

import com.outbreak.backend.model.District;
import com.outbreak.backend.model.GraphData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GraphDataRepository extends JpaRepository<GraphData,Long> {
    List<GraphData> findByDistrictDistrictId(Long districtId);

    List<GraphData> findByDistrictDistrictNameLikeIgnoreCase(String s);

    @Query("SELECT MAX(c.caseYear) FROM GraphData c")
    Integer findMaxYear();

    @Query("SELECT c.caseMonth, SUM(c.numberOfCases) FROM GraphData c WHERE c.caseYear = :latestYear GROUP BY c.caseMonth ORDER BY c.caseMonth")
    List<Object[]> getMonthlyCasesSummary(@Param("latestYear") Integer latestYear);

    // Get total cases for each district in the latest year
    @Query("SELECT g.district.districtName, SUM(g.numberOfCases) " +
            "FROM GraphData g WHERE g.caseYear = :latestYear " +
            "GROUP BY g.district.districtName ORDER BY SUM(g.numberOfCases) DESC")
    List<Object[]> getTotalCasesByDistrict(Integer latestYear);

    @Query("SELECT g.caseWeek, SUM(g.numberOfCases) " +
            "FROM GraphData g " +
            "WHERE g.caseYear = :latestYear " +
            "GROUP BY g.caseWeek " +
            "ORDER BY g.caseWeek")
    List<Object[]> getWeeklyCasesSummary(Integer latestYear);

    @Query("SELECT g.caseYear, SUM(g.numberOfCases) " +
            "FROM GraphData g " +
            "GROUP BY g.caseYear " +
            "ORDER BY g.caseYear")
    List<Object[]> getYearlyCasesSummary();

    Page<GraphData> findByCaseYear(Long caseYear, Pageable pageDetails);

    Page<GraphData> findByDistrict_DistrictNameContainingIgnoreCase(String input, Pageable pageDetails);

    // Custom query to check if a record exists with the same district, caseYear, caseMonth, and caseWeek
    Optional<GraphData> findByDistrictAndCaseYearAndCaseMonthAndCaseWeek(District district, Integer caseYear, Integer caseMonth, Integer caseWeek);
}
