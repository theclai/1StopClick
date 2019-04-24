package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.ShoppingCart;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the ShoppingCart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, String> {

}
