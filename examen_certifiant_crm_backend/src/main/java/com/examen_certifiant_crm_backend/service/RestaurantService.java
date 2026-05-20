package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.response.RestaurantResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.model.Restaurant;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RestaurantService {

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    public Page<RestaurantResponseDTO> findAllActifs(Pageable pageable) {
        return repository.findByActifTrue(pageable)
                .map(this::toResponseDTO);
    }

    public RestaurantResponseDTO findById(Long id) {
        return toResponseDTO(findEntity(id));
    }

    public RestaurantResponseDTO create(Restaurant entity) {
        return toResponseDTO(repository.save(entity));
    }

    public RestaurantResponseDTO update(Long id, Restaurant updates) {
        Restaurant entity = findEntity(id);
        if (updates.getNom() != null) entity.setNom(updates.getNom());
        if (updates.getAdresse() != null) entity.setAdresse(updates.getAdresse());
        if (updates.getVille() != null) entity.setVille(updates.getVille());
        if (updates.getCapaciteMax() != null) entity.setCapaciteMax(updates.getCapaciteMax());
        return toResponseDTO(repository.save(entity));
    }

    @Transactional
    public void softDelete(Long id) {
        Restaurant entity = findEntity(id);
        entity.setActif(false);
        repository.save(entity);
    }

    Restaurant findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
    }

    private RestaurantResponseDTO toResponseDTO(Restaurant entity) {
        RestaurantResponseDTO dto = new RestaurantResponseDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setAdresse(entity.getAdresse());
        dto.setVille(entity.getVille());
        dto.setCapaciteMax(entity.getCapaciteMax());
        dto.setActif(entity.isActif());
        dto.setDateCreation(entity.getDateCreation());
        return dto;
    }
}
