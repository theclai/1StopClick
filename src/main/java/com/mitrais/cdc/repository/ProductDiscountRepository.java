package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.ProductDiscount;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the ProductDiscount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductDiscountRepository extends MongoRepository<ProductDiscount, String> {

}
