package com.examen_certifiant_crm_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Minimum 8 caractères")
    private String password;

    /**
     * Rôle parmi : ADMIN, MANAGER, AGENT, AGENT_RESTAURANT
     * Si absent → AGENT par défaut (principe du moindre privilège)
     */
    @Pattern(regexp = "^(ADMIN|MANAGER|AGENT|AGENT_RESTAURANT)?$",
             message = "Rôle invalide. Valeurs acceptées : ADMIN, MANAGER, AGENT, AGENT_RESTAURANT")
    private String role;

    public RegisterRequestDTO() {}

    public String getNom()      { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom()   { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail()    { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole()     { return role; }
    public void setRole(String role) { this.role = role; }
}
