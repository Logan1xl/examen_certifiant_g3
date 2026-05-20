package com.examen_certifiant_crm_backend.security;

import com.examen_certifiant_crm_backend.entity.AgentCRM;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String email, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    // Méthode statique pour convertir votre entité User en UserDetailsImpl
    // (J'assume que votre entité s'appelle User et possède getId(), getEmail(), getPassword() et getRole())
public static UserDetailsImpl build(AgentCRM agent) {
    // Puisque agent.getRole() retourne un String, on l'utilise directement sans .name()
    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + agent.getRole());

    return new UserDetailsImpl(
            agent.getId(),
            agent.getEmail(),
            agent.getPassword(),
            Collections.singletonList(authority));
}
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Nous utilisons l'email comme identifiant (username)
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}

