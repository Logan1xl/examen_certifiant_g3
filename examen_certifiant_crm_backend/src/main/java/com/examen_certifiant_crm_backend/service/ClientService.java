package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.ClientRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.ClientResponseDTO;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.ClientMapper;
import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Fidelite;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.enums.NiveauFidelite;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.FideliteRepository;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final RestaurantRepository restaurantRepository;
    private final FideliteRepository fideliteRepository;
    private final ClientMapper mapper;

    public ClientService(ClientRepository clientRepository,
                         RestaurantRepository restaurantRepository,
                         FideliteRepository fideliteRepository,
                         ClientMapper mapper) {
        this.clientRepository = clientRepository;
        this.restaurantRepository = restaurantRepository;
        this.fideliteRepository = fideliteRepository;
        this.mapper = mapper;
    }

    public Page<ClientResponseDTO> findAllActifs(Pageable pageable) {
        return clientRepository.findByActifTrue(pageable)
                .map(mapper::toResponseDTO);
    }

    public Page<ClientResponseDTO> search(String keyword, Pageable pageable) {
        return clientRepository.searchClients(keyword, pageable)
                .map(mapper::toResponseDTO);
    }

    public ClientResponseDTO findById(Long id) {
        return mapper.toResponseDTO(findEntity(id));
    }

    public ClientResponseDTO create(ClientRequestDTO dto) {
        Client client = mapper.toEntity(dto);
        if (dto.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", dto.getRestaurantId()));
            client.setRestaurant(restaurant);
        }
        client = clientRepository.save(client);
        Fidelite fidelite = new Fidelite();
        fidelite.setClient(client);
        fidelite.setNiveau(NiveauFidelite.NOUVEAU);
        fideliteRepository.save(fidelite);
        return mapper.toResponseDTO(client);
    }

    public ClientResponseDTO update(Long id, ClientRequestDTO dto) {
        Client client = findEntity(id);
        mapper.updateEntityFromDto(dto, client);
        if (dto.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", dto.getRestaurantId()));
            client.setRestaurant(restaurant);
        }
        return mapper.toResponseDTO(clientRepository.save(client));
    }

    @Transactional
    public void softDelete(Long id) {
        Client client = findEntity(id);
        client.setActif(false);
        clientRepository.save(client);
    }

    Client findEntity(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
    }
}
