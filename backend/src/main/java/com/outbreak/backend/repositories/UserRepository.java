package com.outbreak.backend.repositories;

import com.outbreak.backend.model.District;
import com.outbreak.backend.model.Division;
import com.outbreak.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String username);

    Boolean existsByUserName(String username);

    Boolean existsByEmail(String email);

    Page<User> findByUserNameLikeIgnoreCase(String s, Pageable pageDetails);

    List<User> findByDivision(Division division);

    Page<User> findByUserIdOrUserNameLikeIgnoreCase(Long userId, String s, Pageable pageDetails);
}
