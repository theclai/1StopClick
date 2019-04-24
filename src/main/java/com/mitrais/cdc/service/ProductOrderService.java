package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.ProductOrder;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing ProductOrder.
 */
public interface ProductOrderService {

    /**
     * Save a productOrder.
     *
     * @param productOrder the entity to save
     * @return the persisted entity
     */
    ProductOrder save(ProductOrder productOrder);

    /**
     * Get all the productOrders.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ProductOrder> findAll(Pageable pageable);

    /**
     * Get all the ProductOrder with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    Page<ProductOrder> findAllWithEagerRelationships(Pageable pageable);
    
    /**
     * Get the "id" productOrder.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<ProductOrder> findOne(String id);

    /**
     * Delete the "id" productOrder.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
