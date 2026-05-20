package com.examen_certifiant_crm_backend.repository;

import com.examen_certifiant_crm_backend.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Page<Client> findByActifTrue(Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.actif = true AND " +
           "(LOWER(c.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.prenom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Client> searchClients(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Client c WHERE c.ville = :ville")
    long countByVille(@Param("ville") String ville);

    @Query("SELECT COUNT(c) FROM Client c WHERE c.type = 'ENTREPRISE'")
    long countCorporate();
}
