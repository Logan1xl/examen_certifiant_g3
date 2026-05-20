package com.examen_certifiant_crm_backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class that exposes a {@link ObjectMapper} bean.
 * This bean is required by {@link com.examen_certifiant_crm_backend.security.JwtAuthEntryPoint}
 * to serialize error responses.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
