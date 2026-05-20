package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.request.ClientRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.ClientResponseDTO;
import com.examen_certifiant_crm_backend.service.ClientService;
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
@RequestMapping("/api/clients")
@Tag(name = "Clients", description = "Gestion des clients CRM")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    @Operation(summary = "Lister tous les clients actifs", description = "Retourne une page de clients actifs")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Liste des clients actifs retournée avec succès")
    })
    public ResponseEntity<Page<ClientResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(clientService.findAllActifs(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Rechercher un client par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Client trouvé"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<ClientResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des clients par mot-clé", description = "Recherche dans nom, prénom et email")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Résultats de la recherche retournés avec succès")
    })
    public ResponseEntity<Page<ClientResponseDTO>> search(@RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(clientService.search(keyword, pageable));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau client")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Client créé"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<ClientResponseDTO> create(@Valid @RequestBody ClientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un client existant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Client modifié"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<ClientResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ClientRequestDTO dto) {
        return ResponseEntity.ok(clientService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Désactiver un client (soft delete)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Client désactivé"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        clientService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
