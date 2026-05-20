package com.examen_certifiant_crm_backend.security;

import com.examen_certifiant_crm_backend.repository.AgentCRMRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Charge un AgentCRM depuis la BDD par son email (= username Spring Security).
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AgentCRMRepository agentRepository;

    public UserDetailsServiceImpl(AgentCRMRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return agentRepository.findByEmail(email)
                .map(UserDetailsImpl::build)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Aucun agent trouvé avec l'email : " + email));
    }
}
