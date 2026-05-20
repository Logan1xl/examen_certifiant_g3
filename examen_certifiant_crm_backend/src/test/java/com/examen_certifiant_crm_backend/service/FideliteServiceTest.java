package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.enums.NiveauFidelite;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.repository.FideliteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FideliteServiceTest {

    @Mock private FideliteRepository repository;

    private FideliteService service;

    @BeforeEach
    void setUp() {
        service = new FideliteService(repository);
    }

    @Test
    void findByClientId_WhenExists_ShouldReturnFidelite() {
        Fidelite fidelite = new Fidelite();
        fidelite.setId(1L);
        when(repository.findByClientId(1L)).thenReturn(Optional.of(fidelite));

        Fidelite result = service.findByClientId(1L);

        assertSame(fidelite, result);
    }

    @Test
    void findByClientId_WhenNotExists_ShouldThrow() {
        when(repository.findByClientId(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findByClientId(99L));
    }

    @Test
    void ajouterPoints_ShouldAccumulateAndRecalculateNiveau() {
        Fidelite fidelite = new Fidelite();
        fidelite.setPoints(50);
        fidelite.setNiveau(NiveauFidelite.NOUVEAU);
        when(repository.findByClientId(1L)).thenReturn(Optional.of(fidelite));
        when(repository.save(fidelite)).thenReturn(fidelite);

        Fidelite result = service.ajouterPoints(1L, 60);

        assertEquals(110, result.getPoints());
        assertEquals(NiveauFidelite.BRONZE, result.getNiveau());
    }

    @Test
    void ajouterPoints_MultipleAccumulations_ShouldWork() {
        Fidelite fidelite = new Fidelite();
        fidelite.setPoints(250);
        fidelite.setNiveau(NiveauFidelite.BRONZE);
        when(repository.findByClientId(1L)).thenReturn(Optional.of(fidelite));
        when(repository.save(fidelite)).thenReturn(fidelite);

        Fidelite result = service.ajouterPoints(1L, 100);

        assertEquals(350, result.getPoints());
        assertEquals(NiveauFidelite.SILVER, result.getNiveau());
    }

    @Test
    void calculerNiveau_ShouldReturnNouveau_WhenPointsBelow100() {
        assertEquals(NiveauFidelite.NOUVEAU, service.calculerNiveau(0));
        assertEquals(NiveauFidelite.NOUVEAU, service.calculerNiveau(50));
        assertEquals(NiveauFidelite.NOUVEAU, service.calculerNiveau(99));
    }

    @Test
    void calculerNiveau_ShouldReturnBronze_WhenPoints100To299() {
        assertEquals(NiveauFidelite.BRONZE, service.calculerNiveau(100));
        assertEquals(NiveauFidelite.BRONZE, service.calculerNiveau(200));
        assertEquals(NiveauFidelite.BRONZE, service.calculerNiveau(299));
    }

    @Test
    void calculerNiveau_ShouldReturnSilver_WhenPoints300To599() {
        assertEquals(NiveauFidelite.SILVER, service.calculerNiveau(300));
        assertEquals(NiveauFidelite.SILVER, service.calculerNiveau(450));
        assertEquals(NiveauFidelite.SILVER, service.calculerNiveau(599));
    }

    @Test
    void calculerNiveau_ShouldReturnGold_WhenPoints600To999() {
        assertEquals(NiveauFidelite.GOLD, service.calculerNiveau(600));
        assertEquals(NiveauFidelite.GOLD, service.calculerNiveau(800));
        assertEquals(NiveauFidelite.GOLD, service.calculerNiveau(999));
    }

    @Test
    void calculerNiveau_ShouldReturnPlatinum_WhenPoints1000OrMore() {
        assertEquals(NiveauFidelite.PLATINUM, service.calculerNiveau(1000));
        assertEquals(NiveauFidelite.PLATINUM, service.calculerNiveau(1500));
    }
}
