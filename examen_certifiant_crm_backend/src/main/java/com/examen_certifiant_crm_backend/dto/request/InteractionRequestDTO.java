package com.examen_certifiant_crm_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InteractionRequestDTO {

    @NotNull(message = "L'ID client est obligatoire")
    private Long clientId;

    private Long agentId;

    @NotBlank(message = "Le type est obligatoire (APPEL, EMAIL, VISITE, CHAT)")
    private String type;

    private String description;

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
