package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.service.FideliteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FideliteController.class)
@AutoConfigureMockMvc(addFilters = false)
class FideliteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FideliteService fideliteService;

    @Test
    void findByClientId_shouldReturnFidelite_whenFound() throws Exception {
        when(fideliteService.findByClientId(1L)).thenReturn(createFidelite());

        mockMvc.perform(get("/api/fidelites/client/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.points").value(150))
                .andExpect(jsonPath("$.niveau").value("BRONZE"));
    }

    @Test
    void findByClientId_shouldReturn404_whenNotFound() throws Exception {
        when(fideliteService.findByClientId(99L)).thenThrow(new ResourceNotFoundException("Fidelite", "clientId", 99L));

        mockMvc.perform(get("/api/fidelites/client/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void ajouterPoints_shouldReturnUpdated() throws Exception {
        Fidelite updated = createFidelite();
        updated.setPoints(200);
        when(fideliteService.ajouterPoints(1L, 50)).thenReturn(updated);

        mockMvc.perform(post("/api/fidelites/client/1/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"points\":50}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.points").value(200));
    }

    private Fidelite createFidelite() {
        Client client = new Client();
        client.setId(1L);
        client.setNom("Dupont");
        client.setPrenom("Jean");

        Fidelite fidelite = new Fidelite();
        fidelite.setId(1L);
        fidelite.setClient(client);
        fidelite.setPoints(150);
        fidelite.setNiveau(Fidelite.Niveau.BRONZE);
        fidelite.setDateDebut(LocalDateTime.now());
        return fidelite;
    }
}
