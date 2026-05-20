package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.LoginRequestDTO;
import com.examen_certifiant_crm_backend.dto.LoginResponseDTO;
import com.examen_certifiant_crm_backend.dto.RegisterRequestDTO;
import com.examen_certifiant_crm_backend.model.AgentCRM;
import com.examen_certifiant_crm_backend.repository.AgentCRMRepository;
import com.examen_certifiant_crm_backend.security.JwtUtils;
import com.examen_certifiant_crm_backend.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur d'authentification JWT.
 *
 * POST /auth/login            → retourne un token JWT (public)
 * POST /auth/register         → crée un compte AGENT (public)
 * POST /auth/admin/creer-agent → crée un compte avec rôle choisi (ADMIN seulement)
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentification", description = "Login et création de comptes agents")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AgentCRMRepository    agentRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtUtils              jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          AgentCRMRepository agentRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.agentRepository       = agentRepository;
        this.passwordEncoder       = passwordEncoder;
        this.jwtUtils              = jwtUtils;
    }

    // ── POST /auth/login ─────────────────────────────────────────────────────

    @PostMapping("/login")
    @Operation(summary = "Connexion agent",
               description = "Authentifie un agent CRM et retourne un token JWT valable 24h")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        // Spring Security vérifie email + password + BCrypt + compte actif
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        // Récupère les données complètes depuis la BDD pour la réponse
        AgentCRM agent = agentRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(); // impossible : déjà authentifié

        return ResponseEntity.ok(new LoginResponseDTO(
                jwt,
                agent.getId(),
                agent.getEmail(),
                agent.getNom(),
                agent.getPrenom(),
                agent.getRole()
        ));
    }

    // ── POST /auth/register ──────────────────────────────────────────────────

    /**
     * Auto-inscription : rôle forcé à AGENT (principe du moindre privilège).
     * Pour créer un ADMIN ou MANAGER, utiliser /auth/admin/creer-agent.
     */
    @PostMapping("/register")
    @Operation(summary = "Inscription",
               description = "Crée un compte agent avec le rôle AGENT par défaut")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        if (agentRepository.existsByEmail(request.getEmail())) {
            return emailDejaUtilise(request.getEmail());
        }

        AgentCRM agent = buildAgent(request, "AGENT"); // rôle forcé
        agentRepository.save(agent);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Compte créé avec succès",
                "email",   agent.getEmail(),
                "role",    agent.getRole()
        ));
    }

    // ── POST /auth/admin/creer-agent ─────────────────────────────────────────

    /**
     * Réservé ADMIN : crée un compte avec n'importe quel rôle RBAC.
     * Protégé par @PreAuthorize (Spring Method Security).
     */
    @PostMapping("/admin/creer-agent")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Créer un agent avec rôle spécifique",
               description = "Crée un compte ADMIN, MANAGER, AGENT ou AGENT_RESTAURANT")
    public ResponseEntity<?> adminCreerAgent(
            @Valid @RequestBody RegisterRequestDTO request) {

        if (agentRepository.existsByEmail(request.getEmail())) {
            return emailDejaUtilise(request.getEmail());
        }

        // Le rôle passé dans la requête est respecté (validé par @Pattern dans le DTO)
        String role = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase()
                : "AGENT";

        AgentCRM agent = buildAgent(request, role);
        agentRepository.save(agent);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Agent créé avec succès",
                "email",   agent.getEmail(),
                "role",    agent.getRole(),
                "id",      agent.getId()
        ));
    }

    // ── Helpers privés ───────────────────────────────────────────────────────

    private AgentCRM buildAgent(RegisterRequestDTO request, String role) {
        AgentCRM agent = new AgentCRM();
        agent.setNom(request.getNom());
        agent.setPrenom(request.getPrenom());
        agent.setEmail(request.getEmail().toLowerCase().trim());
        agent.setPassword(passwordEncoder.encode(request.getPassword()));
        agent.setRole(role);
        agent.setActif(true);
        return agent;
    }

    private ResponseEntity<Map<String, Object>> emailDejaUtilise(String email) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "status",  409,
                "error",   "Email déjà utilisé",
                "message", "Un compte existe déjà avec l'email : " + email
        ));
    }
}


