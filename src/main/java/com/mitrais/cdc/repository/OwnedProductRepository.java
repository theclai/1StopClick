package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.OwnedProduct;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the OwnedProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OwnedProductRepository extends MongoRepository<OwnedProduct, String> {

}
