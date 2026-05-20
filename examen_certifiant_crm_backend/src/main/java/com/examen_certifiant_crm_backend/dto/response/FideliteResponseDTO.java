package com.examen_certifiant_crm_backend.dto.response;

import java.time.LocalDateTime;

public class FideliteResponseDTO {

    private Long id;
    private Long clientId;
    private String nomClient;
    private int points;
    private String niveau;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
}
