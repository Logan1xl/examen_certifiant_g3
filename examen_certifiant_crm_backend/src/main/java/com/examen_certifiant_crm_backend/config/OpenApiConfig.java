package com.examen_certifiant_crm_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CRM Backend API")
                        .version("1.0")
                        .description("API de gestion de la relation client (CRM) pour le réseau de restaurants")
                        .contact(new Contact()
                                .name("Support CRM")
                                .email("support@crm-restaurant.com")));
    }
}
