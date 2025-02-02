package com.outbreak.backend.repositories;

import com.outbreak.backend.model.AppRole;
import com.outbreak.backend.model.Role;
import com.outbreak.backend.model.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {


    Optional<Role> findByRoleName(AppRole appRole);

}
