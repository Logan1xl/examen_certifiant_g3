package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.request.InteractionRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.InteractionResponseDTO;
import com.examen_certifiant_crm_backend.service.InteractionService;
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

@RestController
@RequestMapping("/api/interactions")
@Tag(name = "Interactions", description = "Gestion des interactions / tickets support")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @GetMapping
    @Operation(summary = "Lister toutes les interactions")
    @ApiResponse(responseCode = "200", description = "Liste des interactions")
    public ResponseEntity<Page<InteractionResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(interactionService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Rechercher une interaction par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Interaction trouvée"),
        @ApiResponse(responseCode = "404", description = "Interaction non trouvée")
    })
    public ResponseEntity<InteractionResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(interactionService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle interaction / ticket")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Interaction créée"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<InteractionResponseDTO> create(@Valid @RequestBody InteractionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interactionService.create(dto));
    }
}
