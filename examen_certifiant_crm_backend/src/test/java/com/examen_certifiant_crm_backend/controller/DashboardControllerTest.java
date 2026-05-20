package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.CommandeRepository;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClientRepository clientRepository;

    @MockitoBean
    private CommandeRepository commandeRepository;

    @MockitoBean
    private RestaurantRepository restaurantRepository;

    @Test
    void getStats_shouldReturnAllKPIs() throws Exception {
        when(clientRepository.count()).thenReturn(20L);
        when(restaurantRepository.count()).thenReturn(5L);
        when(commandeRepository.count()).thenReturn(150L);
        when(commandeRepository.getStats(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(50000));

        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalClients").value(20))
                .andExpect(jsonPath("$.totalRestaurants").value(5))
                .andExpect(jsonPath("$.totalCommandes").value(150))
                .andExpect(jsonPath("$.caMois").value(50000));
    }

    @Test
    void countByVille_shouldReturnCount() throws Exception {
        when(clientRepository.countByVille("Douala")).thenReturn(10L);

        mockMvc.perform(get("/api/dashboard/clients/ville/Douala"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ville").value("Douala"))
                .andExpect(jsonPath("$.totalClients").value(10));
    }

    @Test
    void countCorporate_shouldReturnCount() throws Exception {
        when(clientRepository.countCorporate()).thenReturn(5L);

        mockMvc.perform(get("/api/dashboard/clients/corporate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("ENTREPRISE"))
                .andExpect(jsonPath("$.totalClients").value(5));
    }
}
