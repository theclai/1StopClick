package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.OrderItem;
import com.mitrais.cdc.domain.ShoppingCart;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing OrderItem.
 */
public interface OrderItemService {

    /**
     * Save a orderItem.
     *
     * @param orderItem the entity to save
     * @return the persisted entity
     */
    OrderItem save(OrderItem orderItem);

    /**
     * Get all the orderItems.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<OrderItem> findAll(Pageable pageable);


    /**
     * Get the "id" orderItem.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<OrderItem> findOne(String id);

    /**
     * Delete the "id" orderItem.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
