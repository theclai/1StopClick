package com.mitrais.cdc.service;

import com.mitrais.cdc.domain.ShoppingCart;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing ShoppingCart.
 */
public interface ShoppingCartService {

    /**
     * Save a shoppingCart.
     *
     * @param shoppingCart the entity to save
     * @return the persisted entity
     */
    ShoppingCart save(ShoppingCart shoppingCart);

    /**
     * Get all the shoppingCarts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ShoppingCart> findAll(Pageable pageable);


    /**
     * Get the "id" shoppingCart.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<ShoppingCart> findOne(String id);

    /**
     * Delete the "id" shoppingCart.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
