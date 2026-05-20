package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.response.RestaurantResponseDTO;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.service.RestaurantService;
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
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurants", description = "Gestion des restaurants partenaires")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    @Operation(summary = "Lister tous les restaurants actifs", description = "Retourne une page de tous les restaurants actifs")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Liste des restaurants retournée avec succès")
    })
    public ResponseEntity<Page<RestaurantResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(restaurantService.findAllActifs(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Rechercher un restaurant par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Restaurant trouvé"),
        @ApiResponse(responseCode = "404", description = "Restaurant non trouvé")
    })
    public ResponseEntity<RestaurantResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau restaurant")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Restaurant créé"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<RestaurantResponseDTO> create(@Valid @RequestBody Restaurant entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.create(entity));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un restaurant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Restaurant modifié"),
        @ApiResponse(responseCode = "404", description = "Restaurant non trouvé")
    })
    public ResponseEntity<RestaurantResponseDTO> update(@PathVariable Long id, @RequestBody Restaurant updates) {
        return ResponseEntity.ok(restaurantService.update(id, updates));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Désactiver un restaurant (soft delete)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Restaurant désactivé"),
        @ApiResponse(responseCode = "404", description = "Restaurant non trouvé")
    })
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        restaurantService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
