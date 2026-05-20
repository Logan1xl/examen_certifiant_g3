package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.InteractionRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.InteractionResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.InteractionMapper;
import com.examen_certifiant_crm_backend.model.AgentCRM;
import com.examen_certifiant_crm_backend.model.Client;
import com.examen_certifiant_crm_backend.model.Interaction;
import com.examen_certifiant_crm_backend.repository.AgentCRMRepository;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.InteractionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final ClientRepository clientRepository;
    private final AgentCRMRepository agentRepository;
    private final InteractionMapper mapper;

    public InteractionService(InteractionRepository interactionRepository,
                              ClientRepository clientRepository,
                              AgentCRMRepository agentRepository,
                              InteractionMapper mapper) {
        this.interactionRepository = interactionRepository;
        this.clientRepository = clientRepository;
        this.agentRepository = agentRepository;
        this.mapper = mapper;
    }

    public Page<InteractionResponseDTO> findAll(Pageable pageable) {
        return interactionRepository.findAll(pageable).map(mapper::toResponseDTO);
    }

    public InteractionResponseDTO findById(Long id) {
        return mapper.toResponseDTO(findEntity(id));
    }

    public InteractionResponseDTO create(InteractionRequestDTO dto) {
        Interaction interaction = mapper.toEntity(dto);
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", dto.getClientId()));
        interaction.setClient(client);
        if (dto.getAgentId() != null) {
            AgentCRM agent = agentRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("AgentCRM", "id", dto.getAgentId()));
            interaction.setAgent(agent);
        }
        return mapper.toResponseDTO(interactionRepository.save(interaction));
    }

    Interaction findEntity(Long id) {
        return interactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interaction", "id", id));
    }
}
