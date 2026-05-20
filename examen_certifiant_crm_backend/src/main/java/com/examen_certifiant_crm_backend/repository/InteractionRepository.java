package com.examen_certifiant_crm_backend.repository;

import com.examen_certifiant_crm_backend.entity.Interaction;
import com.examen_certifiant_crm_backend.entity.Interaction.Statut;
import com.examen_certifiant_crm_backend.entity.Interaction.Type;
import com.examen_certifiant_crm_backend.enums.StatutInteraction;
import com.examen_certifiant_crm_backend.enums.TypeInteraction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    Page<Interaction> findByAgentIdAndStatut(Long agentId, StatutInteraction statut, Pageable pageable);

    @Query("SELECT i FROM Interaction i WHERE i.statut = 'OUVERTE' AND i.agent.id = :agentId")
    List<Interaction> findOpenByAgent(@Param("agentId") Long agentId);

    @Query("SELECT COUNT(i) FROM Interaction i WHERE i.type = :type " +
           "AND i.dateInteraction BETWEEN :debut AND :fin")
    long countByTypeAndPeriod(@Param("type") TypeInteraction type,
                               @Param("debut") LocalDateTime debut,
                               @Param("fin") LocalDateTime fin);
}
