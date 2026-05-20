package com.examen_certifiant_crm_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuration Spring Security 6 — API REST JWT stateless
 *
 * Rôles RBAC (valeurs stockées dans agent_crm.role) :
 *   ADMIN            → accès total
 *   MANAGER          → clients, commandes, restaurants
 *   AGENT            → clients, commandes
 *   AGENT_RESTAURANT → commandes uniquement
 *
 * Note : Spring Security ajoute automatiquement le préfixe "ROLE_"
 * donc hasRole("ADMIN") correspond à l'autorité "ROLE_ADMIN"
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // active @PreAuthorize sur les méthodes
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthEntryPoint      jwtAuthEntryPoint;
    private final JwtAuthFilter          jwtAuthFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthEntryPoint jwtAuthEntryPoint,
                          JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthEntryPoint  = jwtAuthEntryPoint;
        this.jwtAuthFilter      = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ── Désactive CSRF (API REST sans état) ──────────────────────
            .csrf(AbstractHttpConfigurer::disable)

            // ── Sessions STATELESS : aucune session HTTP côté serveur ────
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── 401 JSON au lieu de la page HTML Spring par défaut ───────
            .exceptionHandling(ex ->
                    ex.authenticationEntryPoint(jwtAuthEntryPoint))

            // ── Règles d'autorisation ────────────────────────────────────
            .authorizeHttpRequests(auth -> auth

                // Public
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // Gestion des agents CRM : ADMIN uniquement
                .requestMatchers("/agents/**").hasRole("ADMIN")

                // Clients : ADMIN, MANAGER, AGENT
                .requestMatchers("/clients/**")
                    .hasAnyRole("ADMIN", "MANAGER", "AGENT")

                // Commandes : tous les rôles
                .requestMatchers("/commandes/**")
                    .hasAnyRole("ADMIN", "MANAGER", "AGENT", "AGENT_RESTAURANT")

                // Restaurants : ADMIN, MANAGER
                .requestMatchers("/restaurants/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Tout le reste : authentifié
                .anyRequest().authenticated()
            )

            // ── Fournisseur d'auth DAO (email + BCrypt) ──────────────────
            .authenticationProvider(authenticationProvider())

            // ── Filtre JWT avant le filtre d'auth standard de Spring ─────
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCrypt strength 12 — conforme CNIL / loi 2010/012 Cameroun
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        authProvider.setUserDetailsService(userDetailsService); 
        authProvider.setPasswordEncoder(passwordEncoder());
        
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
