package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.CommandeRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.CommandeResponseDTO;
import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Commande;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.enums.StatutCommande;
import com.examen_certifiant_crm_backend.exception.BusinessException;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.CommandeMapper;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.CommandeRepository;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommandeServiceTest {

    @Mock private CommandeRepository commandeRepository;
    @Mock private ClientRepository clientRepository;
    @Mock private RestaurantRepository restaurantRepository;
    @Mock private CommandeMapper mapper;

    private CommandeService service;

    @BeforeEach
    void setUp() {
        service = new CommandeService(commandeRepository, clientRepository, restaurantRepository, mapper);
    }

    @Test
    void findAll_ShouldReturnPageOfDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        Commande commande = new Commande();
        CommandeResponseDTO dto = new CommandeResponseDTO();
        when(commandeRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(commande)));
        when(mapper.toResponseDTO(commande)).thenReturn(dto);

        Page<CommandeResponseDTO> result = service.findAll(pageable);

        assertEquals(1, result.getTotalElements());
        assertSame(dto, result.getContent().get(0));
    }

    @Test
    void findById_WhenExists_ShouldReturnDTO() {
        Commande commande = new Commande();
        commande.setId(1L);
        CommandeResponseDTO dto = new CommandeResponseDTO();
        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));
        when(mapper.toResponseDTO(commande)).thenReturn(dto);

        CommandeResponseDTO result = service.findById(1L);

        assertSame(dto, result);
    }

    @Test
    void findById_WhenNotExists_ShouldThrow() {
        when(commandeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void create_ShouldAssociateClientAndRestaurantAndSave() {
        CommandeRequestDTO dto = new CommandeRequestDTO();
        dto.setClientId(1L);
        dto.setRestaurantId(2L);
        dto.setMontant(BigDecimal.valueOf(50));

        Commande commande = new Commande();
        Client client = new Client();
        client.setId(1L);
        Restaurant restaurant = new Restaurant();
        restaurant.setId(2L);
        Commande saved = new Commande();
        saved.setId(1L);
        CommandeResponseDTO responseDTO = new CommandeResponseDTO();

        when(mapper.toEntity(dto)).thenReturn(commande);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(restaurant));
        when(commandeRepository.save(commande)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        CommandeResponseDTO result = service.create(dto);

        assertSame(client, commande.getClient());
        assertSame(restaurant, commande.getRestaurant());
        assertSame(responseDTO, result);
    }

    @Test
    void create_WithInvalidClient_ShouldThrow() {
        CommandeRequestDTO dto = new CommandeRequestDTO();
        dto.setClientId(99L);
        dto.setRestaurantId(1L);
        when(mapper.toEntity(dto)).thenReturn(new Commande());
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.create(dto));
    }

    @Test
    void updateStatut_ValidTransition_ShouldUpdate() {
        Commande commande = new Commande();
        commande.setStatut(StatutCommande.EN_ATTENTE);
        Commande saved = new Commande();
        saved.setStatut(StatutCommande.CONFIRMEE);
        CommandeResponseDTO responseDTO = new CommandeResponseDTO();
        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));
        when(commandeRepository.save(commande)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        CommandeResponseDTO result = service.updateStatut(1L, StatutCommande.CONFIRMEE);

        assertEquals(StatutCommande.CONFIRMEE, commande.getStatut());
        assertSame(responseDTO, result);
    }

    @Test
    void updateStatut_InvalidTransition_ShouldThrow() {
        Commande commande = new Commande();
        commande.setStatut(StatutCommande.LIVREE);
        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));

        assertThrows(BusinessException.class, () -> service.updateStatut(1L, StatutCommande.EN_ATTENTE));
    }

    @Test
    void updateStatut_Livree_SetsDateLivraison() {
        Commande commande = new Commande();
        commande.setStatut(StatutCommande.EN_PREPARATION);
        Commande saved = new Commande();
        saved.setStatut(StatutCommande.LIVREE);
        CommandeResponseDTO responseDTO = new CommandeResponseDTO();
        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));
        when(commandeRepository.save(commande)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        service.updateStatut(1L, StatutCommande.LIVREE);

        assertNotNull(commande.getDateLivraison());
    }

    @Test
    void updateStatut_NotLivree_DoesNotSetDateLivraison() {
        Commande commande = new Commande();
        commande.setStatut(StatutCommande.EN_ATTENTE);
        Commande saved = new Commande();
        saved.setStatut(StatutCommande.ANNULEE);
        CommandeResponseDTO responseDTO = new CommandeResponseDTO();
        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));
        when(commandeRepository.save(commande)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        service.updateStatut(1L, StatutCommande.ANNULEE);

        assertNull(commande.getDateLivraison());
    }
}
