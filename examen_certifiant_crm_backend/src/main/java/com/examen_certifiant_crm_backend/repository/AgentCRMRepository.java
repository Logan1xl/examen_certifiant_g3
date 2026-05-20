package com.examen_certifiant_crm_backend.repository;

import com.examen_certifiant_crm_backend.entity.AgentCRM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgentCRMRepository extends JpaRepository<AgentCRM, Long> {

    Optional<AgentCRM> findByEmail(String email);

    boolean existsByEmail(String email);
}
