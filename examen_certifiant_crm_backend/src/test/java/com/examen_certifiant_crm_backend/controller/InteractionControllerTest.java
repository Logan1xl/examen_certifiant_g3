package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.response.InteractionResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.service.InteractionService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InteractionController.class)
@AutoConfigureMockMvc(addFilters = false)
class InteractionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InteractionService interactionService;

    @Test
    void findAll_shouldReturnPage() throws Exception {
        Page<InteractionResponseDTO> page = new PageImpl<>(List.of(createInteractionResponse()));
        when(interactionService.findAll(any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/interactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void findById_shouldReturnInteraction_whenFound() throws Exception {
        when(interactionService.findById(1L)).thenReturn(createInteractionResponse());

        mockMvc.perform(get("/api/interactions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("APPEL"));
    }

    @Test
    void findById_shouldReturn404_whenNotFound() throws Exception {
        when(interactionService.findById(99L)).thenThrow(new ResourceNotFoundException("Interaction", "id", 99L));

        mockMvc.perform(get("/api/interactions/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_shouldReturn201() throws Exception {
        when(interactionService.create(any())).thenReturn(createInteractionResponse());

        mockMvc.perform(post("/api/interactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"clientId\":1,\"type\":\"APPEL\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("APPEL"));
    }

    @Test
    void create_shouldReturn400_whenInvalid() throws Exception {
        mockMvc.perform(post("/api/interactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    private InteractionResponseDTO createInteractionResponse() {
        InteractionResponseDTO dto = new InteractionResponseDTO();
        dto.setId(1L);
        dto.setClientId(1L);
        dto.setNomClient("Dupont Jean");
        dto.setAgentId(1L);
        dto.setNomAgent("Agent Test");
        dto.setType("APPEL");
        dto.setDescription("Appel de suivi client");
        dto.setDateInteraction(LocalDateTime.now());
        dto.setStatut("OUVERTE");
        return dto;
    }
}
