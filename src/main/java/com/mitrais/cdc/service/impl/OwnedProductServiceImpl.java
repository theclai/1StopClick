package com.mitrais.cdc.service.impl;

import com.mitrais.cdc.service.OwnedProductService;
import com.mitrais.cdc.domain.OwnedProduct;
import com.mitrais.cdc.repository.OwnedProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service Implementation for managing OwnedProduct.
 */
@Service
public class OwnedProductServiceImpl implements OwnedProductService {

    private final Logger log = LoggerFactory.getLogger(OwnedProductServiceImpl.class);

    private final OwnedProductRepository ownedProductRepository;

    public OwnedProductServiceImpl(OwnedProductRepository ownedProductRepository) {
        this.ownedProductRepository = ownedProductRepository;
    }

    /**
     * Save a ownedProduct.
     *
     * @param ownedProduct the entity to save
     * @return the persisted entity
     */
    @Override
    public OwnedProduct save(OwnedProduct ownedProduct) {
        log.debug("Request to save OwnedProduct : {}", ownedProduct);
        return ownedProductRepository.save(ownedProduct);
    }

    /**
     * Get all the ownedProducts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<OwnedProduct> findAll(Pageable pageable) {
        log.debug("Request to get all OwnedProducts");
        return ownedProductRepository.findAll(pageable);
    }


    /**
     * Get one ownedProduct by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<OwnedProduct> findOne(String id) {
        log.debug("Request to get OwnedProduct : {}", id);
        return ownedProductRepository.findById(id);
    }

    /**
     * Delete the ownedProduct by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete OwnedProduct : {}", id);
        ownedProductRepository.deleteById(id);
    }
}
