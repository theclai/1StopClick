package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.ProductReview;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing ProductReview.
 */
public interface ProductReviewService {

    /**
     * Save a productReview.
     *
     * @param productReview the entity to save
     * @return the persisted entity
     */
    ProductReview save(ProductReview productReview);

    /**
     * Get all the productReviews.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ProductReview> findAll(Pageable pageable);


    /**
     * Get the "id" productReview.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<ProductReview> findOne(String id);

    /**
     * Delete the "id" productReview.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
