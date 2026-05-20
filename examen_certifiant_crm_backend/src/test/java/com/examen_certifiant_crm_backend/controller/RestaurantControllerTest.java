package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.response.RestaurantResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.service.RestaurantService;
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

@WebMvcTest(RestaurantController.class)
@AutoConfigureMockMvc(addFilters = false)
class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RestaurantService restaurantService;

    @Test
    void findAll_shouldReturnPage() throws Exception {
        Page<RestaurantResponseDTO> page = new PageImpl<>(List.of(createRestaurantResponse()));
        when(restaurantService.findAllActifs(any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/restaurants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void findById_shouldReturnRestaurant_whenFound() throws Exception {
        when(restaurantService.findById(1L)).thenReturn(createRestaurantResponse());

        mockMvc.perform(get("/api/restaurants/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Le Gourmet"));
    }

    @Test
    void findById_shouldReturn404_whenNotFound() throws Exception {
        when(restaurantService.findById(99L)).thenThrow(new ResourceNotFoundException("Restaurant", "id", 99L));

        mockMvc.perform(get("/api/restaurants/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_shouldReturn201() throws Exception {
        when(restaurantService.create(any())).thenReturn(createRestaurantResponse());

        mockMvc.perform(post("/api/restaurants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Le Gourmet\",\"adresse\":\"123 Rue Principale\",\"ville\":\"Douala\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nom").value("Le Gourmet"));
    }

    @Test
    void update_shouldReturnUpdated() throws Exception {
        when(restaurantService.update(any(), any())).thenReturn(createRestaurantResponse());

        mockMvc.perform(put("/api/restaurants/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Le Gourmet\",\"ville\":\"Douala\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Le Gourmet"));
    }

    @Test
    void softDelete_shouldReturn204() throws Exception {
        doNothing().when(restaurantService).softDelete(1L);

        mockMvc.perform(delete("/api/restaurants/1"))
                .andExpect(status().isNoContent());
    }

    private RestaurantResponseDTO createRestaurantResponse() {
        RestaurantResponseDTO dto = new RestaurantResponseDTO();
        dto.setId(1L);
        dto.setNom("Le Gourmet");
        dto.setAdresse("123 Rue Principale");
        dto.setVille("Douala");
        dto.setCapaciteMax(100);
        dto.setActif(true);
        dto.setDateCreation(LocalDateTime.now());
        return dto;
    }
}
