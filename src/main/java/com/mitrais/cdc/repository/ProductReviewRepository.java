package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.ProductReview;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the ProductReview entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductReviewRepository extends MongoRepository<ProductReview, String> {

}
