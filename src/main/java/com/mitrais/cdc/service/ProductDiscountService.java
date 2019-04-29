package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.ProductDiscount;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing ProductDiscount.
 */
public interface ProductDiscountService {

    /**
     * Save a productDiscount.
     *
     * @param productDiscount the entity to save
     * @return the persisted entity
     */
    ProductDiscount save(ProductDiscount productDiscount);

    /**
     * Get all the productDiscounts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ProductDiscount> findAll(Pageable pageable);


    /**
     * Get the "id" productDiscount.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<ProductDiscount> findOne(String id);

    /**
     * Delete the "id" productDiscount.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
