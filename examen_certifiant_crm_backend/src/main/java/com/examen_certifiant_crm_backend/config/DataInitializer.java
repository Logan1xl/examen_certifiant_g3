package com.examen_certifiant_crm_backend.config;

import com.examen_certifiant_crm_backend.entity.*;
import com.examen_certifiant_crm_backend.enums.*;
import com.examen_certifiant_crm_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AgentCRMRepository agentRepository;
    private final ClientRepository clientRepository;
    private final RestaurantRepository restaurantRepository;
    private final CommandeRepository commandeRepository;
    private final InteractionRepository interactionRepository;
    private final FideliteRepository fideliteRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AgentCRMRepository agentRepository,
                           ClientRepository clientRepository,
                           RestaurantRepository restaurantRepository,
                           CommandeRepository commandeRepository,
                           InteractionRepository interactionRepository,
                           FideliteRepository fideliteRepository,
                           PasswordEncoder passwordEncoder) {
        this.agentRepository = agentRepository;
        this.clientRepository = clientRepository;
        this.restaurantRepository = restaurantRepository;
        this.commandeRepository = commandeRepository;
        this.interactionRepository = interactionRepository;
        this.fideliteRepository = fideliteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (agentRepository.count() == 0) {
            System.out.println("=== INITIALISATION DES DONNÉES CRM ===");

            // 1. Initialisation des Agents CRM
            String defaultPassword = passwordEncoder.encode("password");
            
            AgentCRM admin = new AgentCRM("Nouveau", "Administrateur", "admin@test.com", defaultPassword, "ADMIN");
            AgentCRM manager = new AgentCRM("Directeur", "Manager", "manager@test.com", defaultPassword, "MANAGER");
            AgentCRM agent = new AgentCRM("Agent", "CRM", "agent@test.com", defaultPassword, "AGENT");
            AgentCRM resto = new AgentCRM("Restaurant", "Resto", "resto@test.com", defaultPassword, "AGENT_RESTAURANT");

            agentRepository.saveAll(List.of(admin, manager, agent, resto));
            System.out.println("Agents CRM créés avec succès (password: 'password') !");

            // 2. Initialisation des Restaurants
            Restaurant rest1 = new Restaurant();
            rest1.setNom("Le Gourmet Camerounais");
            rest1.setAdresse("Boulevard du 20 mai, Yaoundé");
            rest1.setVille("Yaoundé");
            rest1.setCapaciteMax(50);
            rest1.setActif(true);

            Restaurant rest2 = new Restaurant();
            rest2.setNom("La Table de Douala");
            rest2.setAdresse("Rue Joss, Akwa, Douala");
            rest2.setVille("Douala");
            rest2.setCapaciteMax(80);
            rest2.setActif(true);

            Restaurant rest3 = new Restaurant();
            rest3.setNom("Le Glacier du Nord");
            rest3.setAdresse("Avenue de la République, Garoua");
            rest3.setVille("Garoua");
            rest3.setCapaciteMax(30);
            rest3.setActif(true);

            Restaurant rest4 = new Restaurant();
            rest4.setNom("Sapor Bafoussam");
            rest4.setAdresse("Quartier Tamdja, Bafoussam");
            rest4.setVille("Bafoussam");
            rest4.setCapaciteMax(45);
            rest4.setActif(true);

            Restaurant rest5 = new Restaurant();
            rest5.setNom("Bamenda Fresh");
            rest5.setAdresse("Commercial Avenue, Bamenda");
            rest5.setVille("Bamenda");
            rest5.setCapaciteMax(35);
            rest5.setActif(true);

            restaurantRepository.saveAll(List.of(rest1, rest2, rest3, rest4, rest5));
            System.out.println("Restaurants partenaires créés !");

            // 3. Initialisation des Clients
            Client c1 = new Client();
            c1.setNom("Kamdem");
            c1.setPrenom("Jean");
            c1.setEmail("jean.kamdem@gmail.com");
            c1.setTelephone("+237699887766");
            c1.setVille("Douala");
            c1.setType("INDIVIDUEL");
            c1.setRestaurant(rest2);
            c1.setActif(true);

            Client c2 = new Client();
            c2.setNom("Camtech S.A.");
            c2.setPrenom("Directeur");
            c2.setEmail("contact@camtech.cm");
            c2.setTelephone("+237222334455");
            c2.setVille("Yaoundé");
            c2.setType("ENTREPRISE");
            c2.setRestaurant(rest1);
            c2.setActif(true);

            Client c3 = new Client();
            c3.setNom("Ngo");
            c3.setPrenom("Marie");
            c3.setEmail("marie.ngo@yahoo.fr");
            c3.setTelephone("+237677554433");
            c3.setVille("Bafoussam");
            c3.setType("INDIVIDUEL");
            c3.setRestaurant(rest4);
            c3.setActif(true);

            Client c4 = new Client();
            c4.setNom("Abouem");
            c4.setPrenom("Pierre");
            c4.setEmail("pierre.abouem@gmail.com");
            c4.setTelephone("+237655443322");
            c4.setVille("Garoua");
            c4.setType("INDIVIDUEL");
            c4.setRestaurant(rest3);
            c4.setActif(true);

            Client c5 = new Client();
            c5.setNom("Sodecoton");
            c5.setPrenom("Responsable RH");
            c5.setEmail("contact@sodecoton.cm");
            c5.setTelephone("+237699112233");
            c5.setVille("Garoua");
            c5.setType("ENTREPRISE");
            c5.setRestaurant(rest3);
            c5.setActif(true);

            clientRepository.saveAll(List.of(c1, c2, c3, c4, c5));
            System.out.println("Clients CRM créés !");

            // 4. Comptes Fidélité
            Fidelite f1 = new Fidelite();
            f1.setClient(c1);
            f1.setPoints(120);
            f1.setNiveau(NiveauFidelite.SILVER);
            f1.setDateDebut(LocalDateTime.now().minusMonths(3));

            Fidelite f2 = new Fidelite();
            f2.setClient(c2);
            f2.setPoints(450);
            f2.setNiveau(NiveauFidelite.GOLD);
            f2.setDateDebut(LocalDateTime.now().minusMonths(6));

            Fidelite f3 = new Fidelite();
            f3.setClient(c3);
            f3.setPoints(25);
            f3.setNiveau(NiveauFidelite.BRONZE);
            f3.setDateDebut(LocalDateTime.now().minusMonths(1));

            Fidelite f4 = new Fidelite();
            f4.setClient(c4);
            f4.setPoints(0);
            f4.setNiveau(NiveauFidelite.NOUVEAU);
            f4.setDateDebut(LocalDateTime.now());

            Fidelite f5 = new Fidelite();
            f5.setClient(c5);
            f5.setPoints(1200);
            f5.setNiveau(NiveauFidelite.PLATINUM);
            f5.setDateDebut(LocalDateTime.now().minusYears(1));

            fideliteRepository.saveAll(List.of(f1, f2, f3, f4, f5));
            System.out.println("Profils fidélité créés !");

            // 5. Commandes
            Commande cmd1 = new Commande();
            cmd1.setClient(c1);
            cmd1.setRestaurant(rest2);
            cmd1.setMontant(new BigDecimal("15000"));
            cmd1.setStatut(StatutCommande.LIVREE);
            cmd1.setDateCommande(LocalDateTime.now().minusDays(5));
            cmd1.setDateLivraison(LocalDateTime.now().minusDays(5).plusMinutes(45));

            Commande cmd2 = new Commande();
            cmd2.setClient(c2);
            cmd2.setRestaurant(rest1);
            cmd2.setMontant(new BigDecimal("125000"));
            cmd2.setStatut(StatutCommande.CONFIRMEE);
            cmd2.setDateCommande(LocalDateTime.now().minusHours(2));

            Commande cmd3 = new Commande();
            cmd3.setClient(c3);
            cmd3.setRestaurant(rest4);
            cmd3.setMontant(new BigDecimal("8500"));
            cmd3.setStatut(StatutCommande.EN_PREPARATION);
            cmd3.setDateCommande(LocalDateTime.now().minusMinutes(30));

            Commande cmd4 = new Commande();
            cmd4.setClient(c5);
            cmd4.setRestaurant(rest3);
            cmd4.setMontant(new BigDecimal("320000"));
            cmd4.setStatut(StatutCommande.LIVREE);
            cmd4.setDateCommande(LocalDateTime.now().minusDays(20));
            cmd4.setDateLivraison(LocalDateTime.now().minusDays(20).plusHours(2));

            Commande cmd5 = new Commande();
            cmd5.setClient(c1);
            cmd5.setRestaurant(rest2);
            cmd5.setMontant(new BigDecimal("22500"));
            cmd5.setStatut(StatutCommande.EN_ATTENTE);
            cmd5.setDateCommande(LocalDateTime.now().minusMinutes(5));

            commandeRepository.saveAll(List.of(cmd1, cmd2, cmd3, cmd4, cmd5));
            System.out.println("Commandes d'essai créées !");

            // 6. Interactions
            Interaction i1 = new Interaction();
            i1.setClient(c1);
            i1.setAgent(agent);
            i1.setType(TypeInteraction.APPEL);
            i1.setDescription("Appel de courtoisie. Le client confirme sa satisfaction globale.");
            i1.setStatut(StatutInteraction.FERMEE);
            i1.setDateInteraction(LocalDateTime.now().minusDays(10));

            Interaction i2 = new Interaction();
            i2.setClient(c2);
            i2.setAgent(agent);
            i2.setType(TypeInteraction.EMAIL);
            i2.setDescription("Demande de devis pour un buffet entreprise de 50 personnes à Yaoundé.");
            i2.setStatut(StatutInteraction.OUVERTE);
            i2.setDateInteraction(LocalDateTime.now().minusDays(1));

            Interaction i3 = new Interaction();
            i3.setClient(c3);
            i3.setAgent(admin);
            i3.setType(TypeInteraction.CHAT);
            i3.setDescription("Réclamation concernant un retard de livraison de 20 minutes.");
            i3.setStatut(StatutInteraction.FERMEE);
            i3.setDateInteraction(LocalDateTime.now().minusDays(3));

            interactionRepository.saveAll(List.of(i1, i2, i3));
            System.out.println("Historique d'interactions initialisé !");
            System.out.println("=== INITIALISATION DU CRM ACHEVÉE AVEC SUCCÈS ===");
        }
    }
}
