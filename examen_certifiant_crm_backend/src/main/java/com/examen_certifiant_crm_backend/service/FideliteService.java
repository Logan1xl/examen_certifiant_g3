package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.entity.Fidelite.Niveau;
import com.examen_certifiant_crm_backend.enums.NiveauFidelite;
import com.examen_certifiant_crm_backend.repository.FideliteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FideliteService {

    private static final int SEUIL_BRONZE = 100;
    private static final int SEUIL_SILVER = 300;
    private static final int SEUIL_GOLD = 600;
    private static final int SEUIL_PLATINUM = 1000;

    private final FideliteRepository repository;

    public FideliteService(FideliteRepository repository) {
        this.repository = repository;
    }

    public Fidelite findByClientId(Long clientId) {
        return repository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Fidelite", "clientId", clientId));
    }

    @Transactional
    public Fidelite ajouterPoints(Long clientId, int points) {
        Fidelite fidelite = findByClientId(clientId);
        fidelite.setPoints(fidelite.getPoints() + points);
        fidelite.setNiveau(calculerNiveau(fidelite.getPoints()));
        return repository.save(fidelite);
    }

    public NiveauFidelite calculerNiveau(int points) {
        if (points >= SEUIL_PLATINUM) return NiveauFidelite.PLATINUM;
        if (points >= SEUIL_GOLD) return NiveauFidelite.GOLD;
        if (points >= SEUIL_SILVER) return NiveauFidelite.SILVER;
        if (points >= SEUIL_BRONZE) return NiveauFidelite.BRONZE;
        return NiveauFidelite.NOUVEAU;
    }
}
