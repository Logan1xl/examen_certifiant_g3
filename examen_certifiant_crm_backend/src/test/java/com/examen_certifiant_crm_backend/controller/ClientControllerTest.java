package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.request.ClientRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.ClientResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.service.ClientService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClientService clientService;

    @Test
    void findAll_shouldReturnPage() throws Exception {
        Page<ClientResponseDTO> page = new PageImpl<>(List.of(createClientResponse()));
        when(clientService.findAllActifs(any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void findById_shouldReturnClient_whenFound() throws Exception {
        when(clientService.findById(1L)).thenReturn(createClientResponse());

        mockMvc.perform(get("/api/clients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Dupont"));
    }

    @Test
    void findById_shouldReturn404_whenNotFound() throws Exception {
        when(clientService.findById(99L)).thenThrow(new ResourceNotFoundException("Client", "id", 99L));

        mockMvc.perform(get("/api/clients/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void search_shouldReturnResults() throws Exception {
        Page<ClientResponseDTO> page = new PageImpl<>(List.of(createClientResponse()));
        when(clientService.search("Dupont", PageRequest.of(0, 20))).thenReturn(page);

        mockMvc.perform(get("/api/clients/search?keyword=Dupont"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void create_shouldReturn201() throws Exception {
        when(clientService.create(any())).thenReturn(createClientResponse());

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Dupont\",\"prenom\":\"Jean\",\"email\":\"jean.dupont@email.com\",\"type\":\"PARTICULIER\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nom").value("Dupont"));
    }

    @Test
    void create_shouldReturn400_whenInvalid() throws Exception {
        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_shouldReturnUpdated() throws Exception {
        when(clientService.update(any(), any())).thenReturn(createClientResponse());

        mockMvc.perform(put("/api/clients/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Dupont\",\"prenom\":\"Jean\",\"email\":\"jean.dupont@email.com\",\"type\":\"PARTICULIER\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Dupont"));
    }

    @Test
    void softDelete_shouldReturn204() throws Exception {
        doNothing().when(clientService).softDelete(1L);

        mockMvc.perform(delete("/api/clients/1"))
                .andExpect(status().isNoContent());
    }

    private ClientResponseDTO createClientResponse() {
        ClientResponseDTO dto = new ClientResponseDTO();
        dto.setId(1L);
        dto.setNom("Dupont");
        dto.setPrenom("Jean");
        dto.setEmail("jean.dupont@email.com");
        dto.setTelephone("+237612345678");
        dto.setVille("Douala");
        dto.setType("PARTICULIER");
        dto.setNomRestaurant("Le Gourmet");
        dto.setActif(true);
        dto.setDateCreation(LocalDateTime.now());
        return dto;
    }
}
