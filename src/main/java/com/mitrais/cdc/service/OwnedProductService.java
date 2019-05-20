package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.OwnedProduct;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing OwnedProduct.
 */
public interface OwnedProductService {

    /**
     * Save a ownedProduct.
     *
     * @param ownedProduct the entity to save
     * @return the persisted entity
     */
    OwnedProduct save(OwnedProduct ownedProduct);

    /**
     * Get all the ownedProducts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<OwnedProduct> findAll(Pageable pageable);


    /**
     * Get the "id" ownedProduct.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<OwnedProduct> findOne(String id);

    /**
     * Delete the "id" ownedProduct.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
