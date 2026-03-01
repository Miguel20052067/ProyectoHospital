
package com.Lifechat.gestion_hospital.repository;

import com.Lifechat.gestion_hospital.dto.AuthorizedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AuthorizedUserRepository extends JpaRepository<AuthorizedUser, Long> {
    Optional<AuthorizedUser> findByEmail(String email);
    boolean existsByEmailAndActiveTrue(String email);
}