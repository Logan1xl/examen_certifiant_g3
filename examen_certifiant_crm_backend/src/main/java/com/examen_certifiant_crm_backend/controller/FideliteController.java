package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.response.FideliteResponseDTO;
import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.service.FideliteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fidelites")
@Tag(name = "Fidélité", description = "Gestion du programme de fidélité clients")
public class FideliteController {

    private final FideliteService fideliteService;

    public FideliteController(FideliteService fideliteService) {
        this.fideliteService = fideliteService;
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Consulter le compte fidélité d'un client")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Compte fidélité trouvé"),
        @ApiResponse(responseCode = "404", description = "Client ou compte fidélité non trouvé")
    })
    public ResponseEntity<FideliteResponseDTO> findByClientId(@PathVariable Long clientId) {
        Fidelite fidelite = fideliteService.findByClientId(clientId);
        return ResponseEntity.ok(toResponseDTO(fidelite));
    }

    @PostMapping("/client/{clientId}/points")
    @Operation(summary = "Ajouter des points de fidélité à un client")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Points ajoutés"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<FideliteResponseDTO> ajouterPoints(@PathVariable Long clientId, @RequestBody Map<String, Integer> body) {
        int points = body.getOrDefault("points", 0);
        Fidelite fidelite = fideliteService.ajouterPoints(clientId, points);
        return ResponseEntity.ok(toResponseDTO(fidelite));
    }

    private FideliteResponseDTO toResponseDTO(Fidelite entity) {
        FideliteResponseDTO dto = new FideliteResponseDTO();
        dto.setId(entity.getId());
        dto.setClientId(entity.getClient().getId());
        dto.setNomClient(entity.getClient().getNom() + " " + entity.getClient().getPrenom());
        dto.setPoints(entity.getPoints());
        dto.setNiveau(entity.getNiveau().name());
        dto.setDateDebut(entity.getDateDebut());
        dto.setDateFin(entity.getDateFin());
        return dto;
    }
}
