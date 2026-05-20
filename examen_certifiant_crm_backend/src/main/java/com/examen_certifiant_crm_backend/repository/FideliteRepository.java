package com.examen_certifiant_crm_backend.repository;

import com.examen_certifiant_crm_backend.entity.Fidelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FideliteRepository extends JpaRepository<Fidelite, Long> {

    Optional<Fidelite> findByClientId(Long clientId);
}
