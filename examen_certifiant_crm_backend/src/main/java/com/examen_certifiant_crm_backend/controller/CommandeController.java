package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.request.CommandeRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.CommandeResponseDTO;
import com.examen_certifiant_crm_backend.entity.Commande;
import com.examen_certifiant_crm_backend.service.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/commandes")
@Tag(name = "Commandes", description = "Gestion des commandes et suivi des statuts")
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping
    @Operation(summary = "Lister toutes les commandes", description = "Retourne une page de commandes")
    @ApiResponse(responseCode = "200", description = "Liste des commandes")
    public ResponseEntity<Page<CommandeResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(commandeService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Rechercher une commande par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Commande trouvée"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle commande")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Commande créée"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<CommandeResponseDTO> create(@Valid @RequestBody CommandeRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandeService.create(dto));
    }

    @PatchMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une commande",
              description = "Transitions valides : EN_ATTENTE -> CONFIRMEE/ANNULEE, CONFIRMEE -> EN_PREPARATION/ANNULEE, EN_PREPARATION -> LIVREE/ANNULEE")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Statut mis à jour"),
        @ApiResponse(responseCode = "400", description = "Transition invalide"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeResponseDTO> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Commande.Statut statut = Commande.Statut.valueOf(body.get("statut"));
        return ResponseEntity.ok(commandeService.updateStatut(id, statut));
    }
}
