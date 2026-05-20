package com.examen_certifiant_crm_backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommandeResponseDTO {

    private Long id;
    private Long clientId;
    private String nomClient;
    private Long restaurantId;
    private String nomRestaurant;
    private BigDecimal montant;
    private String statut;
    private LocalDateTime dateCommande;
    private LocalDateTime dateLivraison;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
    public String getNomRestaurant() { return nomRestaurant; }
    public void setNomRestaurant(String nomRestaurant) { this.nomRestaurant = nomRestaurant; }
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDateTime dateCommande) { this.dateCommande = dateCommande; }
    public LocalDateTime getDateLivraison() { return dateLivraison; }
    public void setDateLivraison(LocalDateTime dateLivraison) { this.dateLivraison = dateLivraison; }
}
