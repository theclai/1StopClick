package com.mitrais.cdc.service.impl;

import com.mitrais.cdc.service.ShoppingCartService;
import com.mitrais.cdc.domain.ShoppingCart;
import com.mitrais.cdc.repository.ShoppingCartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service Implementation for managing ShoppingCart.
 */
@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final Logger log = LoggerFactory.getLogger(ShoppingCartServiceImpl.class);

    private final ShoppingCartRepository shoppingCartRepository;

    public ShoppingCartServiceImpl(ShoppingCartRepository shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }

    /**
     * Save a shoppingCart.
     *
     * @param shoppingCart the entity to save
     * @return the persisted entity
     */
    @Override
    public ShoppingCart save(ShoppingCart shoppingCart) {
        log.debug("Request to save ShoppingCart : {}", shoppingCart);
        return shoppingCartRepository.save(shoppingCart);
    }

    /**
     * Get all the shoppingCarts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<ShoppingCart> findAll(Pageable pageable) {
        log.debug("Request to get all ShoppingCarts");
        return shoppingCartRepository.findAll(pageable);
    }


    /**
     * Get one shoppingCart by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<ShoppingCart> findOne(String id) {
        log.debug("Request to get ShoppingCart : {}", id);
        return shoppingCartRepository.findById(id);
    }

    /**
     * Delete the shoppingCart by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete ShoppingCart : {}", id);
        shoppingCartRepository.deleteById(id);
    }
}
