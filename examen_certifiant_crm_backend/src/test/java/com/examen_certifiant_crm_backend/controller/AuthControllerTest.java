package com.examen_certifiant_crm_backend.controller;

import com.examen_certifiant_crm_backend.dto.LoginRequestDTO;
import com.examen_certifiant_crm_backend.dto.RegisterRequestDTO;
import com.examen_certifiant_crm_backend.entity.AgentCRM;
import com.examen_certifiant_crm_backend.repository.AgentCRMRepository;
import com.examen_certifiant_crm_backend.security.JwtUtils;
import com.examen_certifiant_crm_backend.security.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private AgentCRMRepository agentRepository;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private JwtUtils jwtUtils;

    @Test
    void login_shouldReturnToken_whenCredentialsAreValid() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("agent@test.com");
        request.setPassword("password123");

        AgentCRM agent = new AgentCRM();
        agent.setId(1L);
        agent.setEmail("agent@test.com");
        agent.setNom("Test");
        agent.setPrenom("Agent");
        agent.setRole("AGENT");
        agent.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userDetails = UserDetailsImpl.build(agent);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);

        when(agentRepository.findByEmail("agent@test.com")).thenReturn(Optional.of(agent));
        when(jwtUtils.generateToken(any())).thenReturn("mock-jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.email").value("agent@test.com"))
                .andExpect(jsonPath("$.role").value("AGENT"));
    }

    @Test
    void register_shouldCreateAgent_whenEmailIsUnique() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setNom("Test");
        request.setPrenom("Agent");
        request.setEmail("newagent@test.com");
        request.setPassword("password123");

        when(agentRepository.existsByEmail("newagent@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded-password");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Compte créé avec succès"))
                .andExpect(jsonPath("$.email").value("newagent@test.com"))
                .andExpect(jsonPath("$.role").value("AGENT"));
    }

    @Test
    void register_shouldReturn409_whenEmailExists() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setNom("Test");
        request.setPrenom("Agent");
        request.setEmail("existing@test.com");
        request.setPassword("password123");

        when(agentRepository.existsByEmail("existing@test.com")).thenReturn(true);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Email déjà utilisé"));
    }

    @Test
    void adminCreerAgent_shouldCreateAgentWithRole_whenCalledByAdmin() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setNom("Test");
        request.setPrenom("Manager");
        request.setEmail("manager@test.com");
        request.setPassword("password123");
        request.setRole("MANAGER");

        when(agentRepository.existsByEmail("manager@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded-password");

        mockMvc.perform(post("/auth/admin/creer-agent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Agent créé avec succès"))
                .andExpect(jsonPath("$.email").value("manager@test.com"))
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }
}
