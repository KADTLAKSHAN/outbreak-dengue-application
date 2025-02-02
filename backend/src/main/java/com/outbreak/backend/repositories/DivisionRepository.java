package com.outbreak.backend.repositories;

import com.outbreak.backend.model.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DivisionRepository extends JpaRepository<Division,Long> {
    boolean existsByDivisionName(String division);

    Division findByDivisionName(String nugegoda);
}
