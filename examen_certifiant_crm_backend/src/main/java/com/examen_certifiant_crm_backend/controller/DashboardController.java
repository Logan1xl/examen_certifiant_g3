package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.CommandeRepository;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Statistiques et indicateurs clés (KPI)")
public class DashboardController {

    private final ClientRepository clientRepository;
    private final CommandeRepository commandeRepository;
    private final RestaurantRepository restaurantRepository;

    public DashboardController(ClientRepository clientRepository,
                               CommandeRepository commandeRepository,
                               RestaurantRepository restaurantRepository) {
        this.clientRepository = clientRepository;
        this.commandeRepository = commandeRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/stats")
    @Operation(summary = "Indicateurs clés du tableau de bord",
               description = "Retourne le nombre total de clients, restaurants, commandes, CA du mois et interactions ouvertes")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Statistiques du tableau de bord récupérées avec succès")
    })
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        stats.put("totalRestaurants", restaurantRepository.count());
        stats.put("totalCommandes", commandeRepository.count());

        LocalDateTime debutMois = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finMois = LocalDateTime.now();
        BigDecimal caMois = commandeRepository.getStats(debutMois, finMois);
        stats.put("caMois", caMois);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/clients/ville/{ville}")
    @Operation(summary = "Nombre de clients par ville", description = "Retourne le nombre de clients enregistrés dans une ville donnée")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Nombre de clients récupéré avec succès")
    })
    public ResponseEntity<Map<String, Object>> countByVille(@PathVariable String ville) {
        long count = clientRepository.countByVille(ville);
        Map<String, Object> result = new HashMap<>();
        result.put("ville", ville);
        result.put("totalClients", count);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/clients/corporate")
    @Operation(summary = "Nombre de clients de type ENTREPRISE", description = "Retourne le nombre total de clients enregistrés sous le profil entreprise")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Nombre de clients corporate récupéré avec succès")
    })
    public ResponseEntity<Map<String, Object>> countCorporate() {
        long count = clientRepository.countCorporate();
        Map<String, Object> result = new HashMap<>();
        result.put("type", "ENTREPRISE");
        result.put("totalClients", count);
        return ResponseEntity.ok(result);
    }
}
