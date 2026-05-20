package com.examen_certifiant_crm_backend.repository;

import com.examen_certifiant_crm_backend.entity.Commande;
import com.examen_certifiant_crm_backend.enums.StatutCommande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    Page<Commande> findByStatut(StatutCommande statut, Pageable pageable);

    @Query("SELECT c FROM Commande c WHERE c.client.id = :clientId " +
           "AND c.dateCommande BETWEEN :debut AND :fin")
    List<Commande> findByClientAndDateRange(@Param("clientId") Long clientId,
                                            @Param("debut") LocalDateTime debut,
                                            @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(c.montant), 0) FROM Commande c " +
           "WHERE c.statut = 'LIVREE' AND c.dateCommande BETWEEN :debut AND :fin")
    BigDecimal getStats(@Param("debut") LocalDateTime debut,
                        @Param("fin") LocalDateTime fin);
}
