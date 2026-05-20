package com.examen_certifiant_crm_backend.mapper;

import com.examen_certifiant_crm_backend.dto.request.InteractionRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.InteractionResponseDTO;
import com.examen_certifiant_crm_backend.entity.Interaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InteractionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "agent", ignore = true)
    @Mapping(target = "statut", constant = "OUVERTE")
    @Mapping(target = "dateInteraction", ignore = true)
    Interaction toEntity(InteractionRequestDTO dto);

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "nomClient")
    @Mapping(source = "agent.id", target = "agentId")
    @Mapping(source = "agent.nom", target = "nomAgent")
    InteractionResponseDTO toResponseDTO(Interaction entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "agent", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateInteraction", ignore = true)
    void updateEntityFromDto(InteractionRequestDTO dto, @MappingTarget Interaction entity);
}
