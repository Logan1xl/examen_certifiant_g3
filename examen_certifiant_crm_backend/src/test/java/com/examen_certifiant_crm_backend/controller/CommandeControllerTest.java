package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.response.CommandeResponseDTO;
import com.examen_certifiant_crm_backend.entity.Commande;
import com.examen_certifiant_crm_backend.exception.BusinessException;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.service.CommandeService;
import com.examen_certifiant_crm_backend.enums.StatutCommande;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommandeController.class)
@AutoConfigureMockMvc(addFilters = false)
class CommandeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommandeService commandeService;

    @Test
    void findAll_shouldReturnPage() throws Exception {
        Page<CommandeResponseDTO> page = new PageImpl<>(List.of(createCommandeResponse()));
        when(commandeService.findAll(any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/commandes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void findById_shouldReturnCommande_whenFound() throws Exception {
        when(commandeService.findById(1L)).thenReturn(createCommandeResponse());

        mockMvc.perform(get("/api/commandes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.montant").value(100.0));
    }

    @Test
    void findById_shouldReturn404_whenNotFound() throws Exception {
        when(commandeService.findById(99L)).thenThrow(new ResourceNotFoundException("Commande", "id", 99L));

        mockMvc.perform(get("/api/commandes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_shouldReturn201() throws Exception {
        when(commandeService.create(any())).thenReturn(createCommandeResponse());

        mockMvc.perform(post("/api/commandes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"clientId\":1,\"restaurantId\":1,\"montant\":100.0}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.montant").value(100.0));
    }

    @Test
    void create_shouldReturn400_whenInvalid() throws Exception {
        mockMvc.perform(post("/api/commandes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateStatut_shouldReturnUpdated() throws Exception {
        CommandeResponseDTO response = createCommandeResponse();
        response.setStatut("CONFIRMEE");
        when(commandeService.updateStatut(1L, StatutCommande.CONFIRMEE)).thenReturn(response);

        mockMvc.perform(patch("/api/commandes/1/statut")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"statut\":\"CONFIRMEE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("CONFIRMEE"));
    }

    @Test
    void updateStatut_shouldReturn400_whenInvalidTransition() throws Exception {
        when(commandeService.updateStatut(1L, StatutCommande.LIVREE))
                .thenThrow(new BusinessException("Transition invalide : EN_ATTENTE -> LIVREE"));

        mockMvc.perform(patch("/api/commandes/1/statut")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"statut\":\"LIVREE\"}"))
                .andExpect(status().isBadRequest());
    }

    private CommandeResponseDTO createCommandeResponse() {
        CommandeResponseDTO dto = new CommandeResponseDTO();
        dto.setId(1L);
        dto.setClientId(1L);
        dto.setNomClient("Dupont Jean");
        dto.setRestaurantId(1L);
        dto.setNomRestaurant("Le Gourmet");
        dto.setMontant(BigDecimal.valueOf(100.0));
        dto.setStatut("EN_ATTENTE");
        dto.setDateCommande(LocalDateTime.now());
        return dto;
    }
}
