package com.examen_certifiant_crm_backend.mapper;

import com.examen_certifiant_crm_backend.dto.request.CommandeRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.CommandeResponseDTO;
import com.examen_certifiant_crm_backend.entity.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommandeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "statut", constant = "EN_ATTENTE")
    @Mapping(target = "dateCommande", ignore = true)
    @Mapping(target = "dateLivraison", ignore = true)
    Commande toEntity(CommandeRequestDTO dto);

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "nomClient")
    @Mapping(source = "restaurant.id", target = "restaurantId")
    @Mapping(source = "restaurant.nom", target = "nomRestaurant")
    CommandeResponseDTO toResponseDTO(Commande entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateCommande", ignore = true)
    @Mapping(target = "dateLivraison", ignore = true)
    void updateEntityFromDto(CommandeRequestDTO dto, @MappingTarget Commande entity);
}
