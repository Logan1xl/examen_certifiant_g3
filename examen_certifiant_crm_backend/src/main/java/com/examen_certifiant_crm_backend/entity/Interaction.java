package com.examen_certifiant_crm_backend.entity;

import com.examen_certifiant_crm_backend.enums.StatutInteraction;
import com.examen_certifiant_crm_backend.enums.TypeInteraction;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interaction")
public class Interaction {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private AgentCRM agent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeInteraction type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_interaction")
    private LocalDateTime dateInteraction = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutInteraction statut = StatutInteraction.OUVERTE;

    public Interaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public AgentCRM getAgent() { return agent; }
    public void setAgent(AgentCRM agent) { this.agent = agent; }
    public TypeInteraction getType() { return type; }
    public void setType(TypeInteraction type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDateInteraction() { return dateInteraction; }
    public void setDateInteraction(LocalDateTime dateInteraction) { this.dateInteraction = dateInteraction; }
    public StatutInteraction getStatut() { return statut; }
    public void setStatut(StatutInteraction statut) { this.statut = statut; }
}
