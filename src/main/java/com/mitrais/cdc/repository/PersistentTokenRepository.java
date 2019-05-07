package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.PersistentToken;
import com.mitrais.cdc.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface PersistentTokenRepository extends MongoRepository<PersistentToken, String> {
    List<PersistentToken> findByUser(User user);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);
}
