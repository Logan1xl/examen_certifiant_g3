package com.examen_certifiant_crm_backend.mapper;

import com.examen_certifiant_crm_backend.dto.request.ClientRequestDTO;
import com.examen_certifiant_crm_backend.dto.response.ClientResponseDTO;
import com.examen_certifiant_crm_backend.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "dateCreation", ignore = true)
    Client toEntity(ClientRequestDTO dto);

    @Mapping(source = "restaurant.nom", target = "nomRestaurant")
    ClientResponseDTO toResponseDTO(Client entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "actif", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    void updateEntityFromDto(ClientRequestDTO dto, @MappingTarget Client entity);
}
