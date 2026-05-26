package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.repository.CouchDbUserRepository;
import com.survey.universe.service.UserService;
import com.survey.universe.spring.configuration.bean.SlugIdGenerator;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Primary
@AllArgsConstructor
public class CouchDbUserService implements UserService {

    private final CouchDbUserRepository userRepository;
    private final SlugIdGenerator slugGenerator;
	private final UUIDGenerator uuidGenerator;


    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByField("email", email);
    }

    @Override
    public Optional<User> add(User user) {
        if (findByEmail(user.getEmail()).isPresent()) {
            return Optional.empty();
        }
        
        if (user.getId() == null || user.getId().isBlank()) {
            user.setId(DocType.USER.join(uuidGenerator.generateUUIDv7()));
        }

        user.setRevision(null);
        user.setSlugId(slugGenerator.generate());
        user.setCreatedAt(Instant.now());
        
        return userRepository.save(user);
    }

    @Override
    public Optional<User> update(User user) {
        Optional<User> foundUserOpt = userRepository.findById(user.getId());
        if (foundUserOpt.isEmpty()) {
            return Optional.empty();
        }
        
        User currentDbUser = foundUserOpt.get();        
        user.setRevision(currentDbUser.getRevision());
        user.setCreatedAt(currentDbUser.getCreatedAt());
        
        user.setRootType("user");

        return userRepository.save(user);
    }


    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> getAll() {
        return userRepository.getAll();
    }

    @Override
    public List<User> filter(String search, Boolean showDeleted) {
        boolean activeShowDeleted = Boolean.TRUE.equals(showDeleted);

        return getAll().stream()
                .filter(u -> !u.isDeleted() || activeShowDeleted)
                .filter(s -> search == null || containsSearchTerm(s, search))
                .toList();
    }


    private boolean containsSearchTerm(User u, String term) {
        String lowerTerm = term.toLowerCase();
        return (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(lowerTerm)) ||
               (u.getLastName() != null && u.getLastName().toLowerCase().contains(lowerTerm)) ||
               (u.getEmail() != null && u.getEmail().toLowerCase().contains(lowerTerm));
    }

    @Override
    public Optional<User> findBySlugId(String slugId) {
        return userRepository.findByField("slug_id", slugId);
    }
}
