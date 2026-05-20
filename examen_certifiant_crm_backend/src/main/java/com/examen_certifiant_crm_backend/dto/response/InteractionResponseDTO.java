package com.examen_certifiant_crm_backend.dto.response;

import java.time.LocalDateTime;

public class InteractionResponseDTO {

    private Long id;
    private Long clientId;
    private String nomClient;
    private Long agentId;
    private String nomAgent;
    private String type;
    private String description;
    private LocalDateTime dateInteraction;
    private String statut;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    public String getNomAgent() { return nomAgent; }
    public void setNomAgent(String nomAgent) { this.nomAgent = nomAgent; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDateInteraction() { return dateInteraction; }
    public void setDateInteraction(LocalDateTime dateInteraction) { this.dateInteraction = dateInteraction; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
