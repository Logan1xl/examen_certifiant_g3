package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.InteractionRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.InteractionResponseDTO;
import com.examen_certifiant_crm_backend.entity.AgentCRM;
import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Interaction;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.InteractionMapper;
import com.examen_certifiant_crm_backend.repository.AgentCRMRepository;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.InteractionRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InteractionServiceTest {

    @Mock private InteractionRepository interactionRepository;
    @Mock private ClientRepository clientRepository;
    @Mock private AgentCRMRepository agentRepository;
    @Mock private InteractionMapper mapper;

    private InteractionService service;

    @BeforeEach
    void setUp() {
        service = new InteractionService(interactionRepository, clientRepository, agentRepository, mapper);
    }

    @Test
    void findAll_ShouldReturnPageOfDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        Interaction interaction = new Interaction();
        InteractionResponseDTO dto = new InteractionResponseDTO();
        when(interactionRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(interaction)));
        when(mapper.toResponseDTO(interaction)).thenReturn(dto);

        Page<InteractionResponseDTO> result = service.findAll(pageable);

        assertEquals(1, result.getTotalElements());
        assertSame(dto, result.getContent().get(0));
    }

    @Test
    void findById_WhenExists_ShouldReturnDTO() {
        Interaction interaction = new Interaction();
        interaction.setId(1L);
        InteractionResponseDTO dto = new InteractionResponseDTO();
        when(interactionRepository.findById(1L)).thenReturn(Optional.of(interaction));
        when(mapper.toResponseDTO(interaction)).thenReturn(dto);

        InteractionResponseDTO result = service.findById(1L);

        assertSame(dto, result);
    }

    @Test
    void findById_WhenNotExists_ShouldThrow() {
        when(interactionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void create_WithoutAgent_ShouldSave() {
        InteractionRequestDTO dto = new InteractionRequestDTO();
        dto.setClientId(1L);
        dto.setAgentId(null);
        Interaction interaction = new Interaction();
        Client client = new Client();
        client.setId(1L);
        Interaction saved = new Interaction();
        saved.setId(1L);
        InteractionResponseDTO responseDTO = new InteractionResponseDTO();
        when(mapper.toEntity(dto)).thenReturn(interaction);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(interactionRepository.save(interaction)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        InteractionResponseDTO result = service.create(dto);

        assertSame(client, interaction.getClient());
        assertNull(interaction.getAgent());
        assertSame(responseDTO, result);
        verify(agentRepository, never()).findById(any());
    }

    @Test
    void create_WithAgent_ShouldAssociateAgent() {
        InteractionRequestDTO dto = new InteractionRequestDTO();
        dto.setClientId(1L);
        dto.setAgentId(2L);
        Interaction interaction = new Interaction();
        Client client = new Client();
        client.setId(1L);
        AgentCRM agent = new AgentCRM();
        agent.setId(2L);
        Interaction saved = new Interaction();
        saved.setId(1L);
        InteractionResponseDTO responseDTO = new InteractionResponseDTO();
        when(mapper.toEntity(dto)).thenReturn(interaction);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(agentRepository.findById(2L)).thenReturn(Optional.of(agent));
        when(interactionRepository.save(interaction)).thenReturn(saved);
        when(mapper.toResponseDTO(saved)).thenReturn(responseDTO);

        InteractionResponseDTO result = service.create(dto);

        assertSame(agent, interaction.getAgent());
        assertSame(responseDTO, result);
    }

    @Test
    void create_WithInvalidClient_ShouldThrow() {
        InteractionRequestDTO dto = new InteractionRequestDTO();
        dto.setClientId(99L);
        when(mapper.toEntity(dto)).thenReturn(new Interaction());
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.create(dto));
    }

    @Test
    void create_WithInvalidAgent_ShouldThrow() {
        InteractionRequestDTO dto = new InteractionRequestDTO();
        dto.setClientId(1L);
        dto.setAgentId(99L);
        Interaction interaction = new Interaction();
        Client client = new Client();
        client.setId(1L);
        when(mapper.toEntity(dto)).thenReturn(interaction);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(agentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.create(dto));
    }
}
