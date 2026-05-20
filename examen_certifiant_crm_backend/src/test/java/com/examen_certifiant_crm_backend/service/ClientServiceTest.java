package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.ClientRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.ClientResponseDTO;
import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.ClientMapper;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.FideliteRepository;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock private ClientRepository clientRepository;
    @Mock private RestaurantRepository restaurantRepository;
    @Mock private FideliteRepository fideliteRepository;
    @Mock private ClientMapper mapper;

    private ClientService service;

    @BeforeEach
    void setUp() {
        service = new ClientService(clientRepository, restaurantRepository, fideliteRepository, mapper);
    }

    @Test
    void findAllActifs_ShouldReturnPageOfDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        Client client = new Client();
        ClientResponseDTO dto = new ClientResponseDTO();
        when(clientRepository.findByActifTrue(pageable)).thenReturn(new PageImpl<>(List.of(client)));
        when(mapper.toResponseDTO(client)).thenReturn(dto);

        Page<ClientResponseDTO> result = service.findAllActifs(pageable);

        assertEquals(1, result.getTotalElements());
        assertSame(dto, result.getContent().get(0));
    }

    @Test
    void search_ShouldReturnMatchingClients() {
        Pageable pageable = PageRequest.of(0, 10);
        Client client = new Client();
        ClientResponseDTO dto = new ClientResponseDTO();
        when(clientRepository.searchClients("test", pageable)).thenReturn(new PageImpl<>(List.of(client)));
        when(mapper.toResponseDTO(client)).thenReturn(dto);

        Page<ClientResponseDTO> result = service.search("test", pageable);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void findById_WhenExists_ShouldReturnDTO() {
        Client client = new Client();
        client.setId(1L);
        ClientResponseDTO dto = new ClientResponseDTO();
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(mapper.toResponseDTO(client)).thenReturn(dto);

        ClientResponseDTO result = service.findById(1L);

        assertSame(dto, result);
    }

    @Test
    void findById_WhenNotExists_ShouldThrow() {
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void create_WithoutRestaurant_ShouldSaveClientAndFidelite() {
        ClientRequestDTO dto = new ClientRequestDTO();
        dto.setNom("Dupont");
        Client client = new Client();
        client.setNom("Dupont");
        Client saved = new Client();
        saved.setId(1L);
        saved.setNom("Dupont");
        ClientResponseDTO responseDTO = new ClientResponseDTO();
        when(mapper.toEntity(dto)).thenReturn(client);
        when(clientRepository.save(client)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);
        when(fideliteRepository.save(any(Fidelite.class))).thenAnswer(i -> i.getArgument(0));

        ClientResponseDTO result = service.create(dto);

        assertSame(responseDTO, result);
        verify(fideliteRepository).save(any(Fidelite.class));
    }

    @Test
    void create_WithRestaurant_ShouldAssociateRestaurant() {
        ClientRequestDTO dto = new ClientRequestDTO();
        dto.setRestaurantId(1L);
        Client client = new Client();
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        Client saved = new Client();
        saved.setId(1L);
        ClientResponseDTO responseDTO = new ClientResponseDTO();
        when(mapper.toEntity(dto)).thenReturn(client);
        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(clientRepository.save(client)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);
        when(fideliteRepository.save(any(Fidelite.class))).thenAnswer(i -> i.getArgument(0));

        ClientResponseDTO result = service.create(dto);

        assertSame(restaurant, client.getRestaurant());
        assertSame(responseDTO, result);
    }

    @Test
    void create_WithInvalidRestaurant_ShouldThrow() {
        ClientRequestDTO dto = new ClientRequestDTO();
        dto.setRestaurantId(99L);
        Client client = new Client();
        when(mapper.toEntity(dto)).thenReturn(client);
        when(restaurantRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.create(dto));
    }

    @Test
    void update_ShouldUpdateAndReturnDTO() {
        Long id = 1L;
        ClientRequestDTO dto = new ClientRequestDTO();
        Client existing = new Client();
        existing.setId(id);
        Client saved = new Client();
        saved.setId(id);
        ClientResponseDTO responseDTO = new ClientResponseDTO();
        when(clientRepository.findById(id)).thenReturn(Optional.of(existing));
        when(clientRepository.save(existing)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        ClientResponseDTO result = service.update(id, dto);

        assertSame(responseDTO, result);
        verify(mapper).updateEntityFromDto(dto, existing);
    }

    @Test
    void update_WithRestaurant_ShouldAssociate() {
        Long id = 1L;
        ClientRequestDTO dto = new ClientRequestDTO();
        dto.setRestaurantId(2L);
        Client existing = new Client();
        existing.setId(id);
        Client saved = new Client();
        saved.setId(id);
        ClientResponseDTO responseDTO = new ClientResponseDTO();
        Restaurant restaurant = new Restaurant();
        restaurant.setId(2L);
        when(clientRepository.findById(id)).thenReturn(Optional.of(existing));
        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(restaurant));
        when(clientRepository.save(existing)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        ClientResponseDTO result = service.update(id, dto);

        assertSame(restaurant, existing.getRestaurant());
        assertSame(responseDTO, result);
    }

    @Test
    void softDelete_ShouldSetActifFalse() {
        Client client = new Client();
        client.setId(1L);
        client.setActif(true);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));

        service.softDelete(1L);

        assertFalse(client.isActif());
        verify(clientRepository).save(client);
    }
}
