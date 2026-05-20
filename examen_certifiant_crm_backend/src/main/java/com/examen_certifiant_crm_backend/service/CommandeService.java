package com.examen_certifiant_crm_backend.service;

import com.examen_certifiant_crm_backend.dto.request.CommandeRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.CommandeResponseDTO;
import com.examen_certifiant_crm_backend.exception.BusinessException;
import com.examen_certifiant_crm_backend.exception.ResourceNotFoundException;
import com.examen_certifiant_crm_backend.mapper.CommandeMapper;
import com.examen_certifiant_crm_backend.entity.Client;
import com.examen_certifiant_crm_backend.entity.Commande;
import com.examen_certifiant_crm_backend.entity.Restaurant;
import com.examen_certifiant_crm_backend.enums.StatutCommande;
import com.examen_certifiant_crm_backend.repository.ClientRepository;
import com.examen_certifiant_crm_backend.repository.CommandeRepository;
import com.examen_certifiant_crm_backend.repository.RestaurantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class CommandeService {

    private static final Map<StatutCommande, Set<StatutCommande>> TRANSITIONS = Map.of(
            StatutCommande.EN_ATTENTE, Set.of(StatutCommande.CONFIRMEE, StatutCommande.ANNULEE),
            StatutCommande.CONFIRMEE, Set.of(StatutCommande.EN_PREPARATION, StatutCommande.ANNULEE),
            StatutCommande.EN_PREPARATION, Set.of(StatutCommande.LIVREE, StatutCommande.ANNULEE),
            StatutCommande.LIVREE, Set.of(),
            StatutCommande.ANNULEE, Set.of()
    );

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final RestaurantRepository restaurantRepository;
    private final CommandeMapper mapper;

    public CommandeService(CommandeRepository commandeRepository,
                           ClientRepository clientRepository,
                           RestaurantRepository restaurantRepository,
                           CommandeMapper mapper) {
        this.commandeRepository = commandeRepository;
        this.clientRepository = clientRepository;
        this.restaurantRepository = restaurantRepository;
        this.mapper = mapper;
    }

    public Page<CommandeResponseDTO> findAll(Pageable pageable) {
        return commandeRepository.findAll(pageable).map(mapper::toResponseDTO);
    }

    public CommandeResponseDTO findById(Long id) {
        return mapper.toResponseDTO(findEntity(id));
    }

    public CommandeResponseDTO create(CommandeRequestDTO dto) {
        Commande commande = mapper.toEntity(dto);
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", dto.getClientId()));
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", dto.getRestaurantId()));
        commande.setClient(client);
        commande.setRestaurant(restaurant);
        return mapper.toResponseDTO(commandeRepository.save(commande));
    }

    @Transactional
    public CommandeResponseDTO updateStatut(Long id, StatutCommande nouveauStatut) {
        Commande commande = findEntity(id);
        StatutCommande actuel = commande.getStatut();
        if (!TRANSITIONS.getOrDefault(actuel, Set.of()).contains(nouveauStatut)) {
            throw new BusinessException(
                    String.format("Transition invalide : %s -> %s", actuel, nouveauStatut));
        }
        commande.setStatut(nouveauStatut);
        if (nouveauStatut == StatutCommande.LIVREE) {
            commande.setDateLivraison(java.time.LocalDateTime.now());
        }
        return mapper.toResponseDTO(commandeRepository.save(commande));
    }

    Commande findEntity(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", "id", id));
    }
}
