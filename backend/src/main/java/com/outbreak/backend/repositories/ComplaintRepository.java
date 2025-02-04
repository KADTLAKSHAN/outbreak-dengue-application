package com.outbreak.backend.repositories;

import com.outbreak.backend.model.Complaint;
import com.outbreak.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint,Long> {

    // Fetch all complaints: unreplied first, then replied, both sorted by latest date
    Page<Complaint> findAllByOrderByStatusAscComplaintDateDesc(Pageable pageable);

    Page<Complaint> findByUserOrderByStatusAscComplaintDateDesc(User user, Pageable pageable);


}
