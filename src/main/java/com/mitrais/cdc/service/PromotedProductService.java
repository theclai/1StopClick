package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.PromotedProduct;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing PromotedProduct.
 */
public interface PromotedProductService {

    /**
     * Save a promotedProduct.
     *
     * @param promotedProduct the entity to save
     * @return the persisted entity
     */
    PromotedProduct save(PromotedProduct promotedProduct);

    /**
     * Get all the promotedProducts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<PromotedProduct> findAll(Pageable pageable);


    /**
     * Get the "id" promotedProduct.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<PromotedProduct> findOne(String id);

    /**
     * Delete the "id" promotedProduct.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
