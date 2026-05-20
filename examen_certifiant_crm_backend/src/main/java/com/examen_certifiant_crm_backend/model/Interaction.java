package com.examen_certifiant_crm_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interaction")
public class Interaction {

    public enum Type {
        APPEL, EMAIL, VISITE, CHAT
    }

    public enum Statut {
        OUVERTE, FERMEE
    }

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
    private Type type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_interaction")
    private LocalDateTime dateInteraction = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Statut statut = Statut.OUVERTE;

    public Interaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public AgentCRM getAgent() { return agent; }
    public void setAgent(AgentCRM agent) { this.agent = agent; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDateInteraction() { return dateInteraction; }
    public void setDateInteraction(LocalDateTime dateInteraction) { this.dateInteraction = dateInteraction; }
    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }
}
