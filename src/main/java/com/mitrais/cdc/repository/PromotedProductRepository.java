package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.PromotedProduct;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the PromotedProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PromotedProductRepository extends MongoRepository<PromotedProduct, String> {

}
