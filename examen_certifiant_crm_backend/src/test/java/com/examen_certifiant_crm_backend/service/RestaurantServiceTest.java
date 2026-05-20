package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.response.RestaurantResponseDTO;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceTest {

    @Mock private RestaurantRepository repository;

    private RestaurantService service;

    @BeforeEach
    void setUp() {
        service = new RestaurantService(repository);
    }

    @Test
    void findAllActifs_ShouldReturnPageOfDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setNom("Chez Dupont");
        restaurant.setActif(true);
        restaurant.setDateCreation(LocalDateTime.now());
        when(repository.findByActifTrue(pageable)).thenReturn(new PageImpl<>(List.of(restaurant)));

        Page<RestaurantResponseDTO> result = service.findAllActifs(pageable);

        assertEquals(1, result.getTotalElements());
        RestaurantResponseDTO dto = result.getContent().get(0);
        assertEquals("Chez Dupont", dto.getNom());
        assertTrue(dto.isActif());
    }

    @Test
    void findById_WhenExists_ShouldReturnDTO() {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setNom("Test");
        when(repository.findById(1L)).thenReturn(Optional.of(restaurant));

        RestaurantResponseDTO result = service.findById(1L);

        assertEquals("Test", result.getNom());
    }

    @Test
    void findById_WhenNotExists_ShouldThrow() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void create_ShouldSaveAndReturnDTO() {
        Restaurant entity = new Restaurant();
        entity.setNom("Nouveau");
        Restaurant saved = new Restaurant();
        saved.setId(1L);
        saved.setNom("Nouveau");
        when(repository.save(entity)).thenReturn(saved);

        RestaurantResponseDTO result = service.create(entity);

        assertEquals("Nouveau", result.getNom());
        assertEquals(1L, result.getId());
    }

    @Test
    void update_ShouldUpdateNonNullFields() {
        Restaurant existing = new Restaurant();
        existing.setId(1L);
        existing.setNom("Ancien");
        existing.setAdresse("Ancienne adresse");

        Restaurant updates = new Restaurant();
        updates.setNom("Nouveau");
        updates.setAdresse(null);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        RestaurantResponseDTO result = service.update(1L, updates);

        assertEquals("Nouveau", existing.getNom());
        assertEquals("Ancienne adresse", existing.getAdresse());
    }

    @Test
    void update_WithAllFields_ShouldUpdateAll() {
        Restaurant existing = new Restaurant();
        existing.setId(1L);
        existing.setNom("A");
        existing.setAdresse("B");
        existing.setVille("C");
        existing.setCapaciteMax(50);

        Restaurant updates = new Restaurant();
        updates.setNom("X");
        updates.setAdresse("Y");
        updates.setVille("Z");
        updates.setCapaciteMax(100);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        RestaurantResponseDTO result = service.update(1L, updates);

        assertEquals("X", existing.getNom());
        assertEquals("Y", existing.getAdresse());
        assertEquals("Z", existing.getVille());
        assertEquals(100, existing.getCapaciteMax());
    }

    @Test
    void softDelete_ShouldSetActifFalse() {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setActif(true);
        when(repository.findById(1L)).thenReturn(Optional.of(restaurant));

        service.softDelete(1L);

        assertFalse(restaurant.isActif());
        verify(repository).save(restaurant);
    }
}
