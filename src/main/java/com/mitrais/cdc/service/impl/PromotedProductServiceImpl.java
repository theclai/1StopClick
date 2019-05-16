package com.mitrais.cdc.service.impl;

import com.mitrais.cdc.service.PromotedProductService;
import com.mitrais.cdc.domain.PromotedProduct;
import com.mitrais.cdc.repository.PromotedProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service Implementation for managing PromotedProduct.
 */
@Service
public class PromotedProductServiceImpl implements PromotedProductService {

    private final Logger log = LoggerFactory.getLogger(PromotedProductServiceImpl.class);

    private final PromotedProductRepository promotedProductRepository;

    public PromotedProductServiceImpl(PromotedProductRepository promotedProductRepository) {
        this.promotedProductRepository = promotedProductRepository;
    }

    /**
     * Save a promotedProduct.
     *
     * @param promotedProduct the entity to save
     * @return the persisted entity
     */
    @Override
    public PromotedProduct save(PromotedProduct promotedProduct) {
        log.debug("Request to save PromotedProduct : {}", promotedProduct);
        return promotedProductRepository.save(promotedProduct);
    }

    /**
     * Get all the promotedProducts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<PromotedProduct> findAll(Pageable pageable) {
        log.debug("Request to get all PromotedProducts");
        return promotedProductRepository.findAll(pageable);
    }


    /**
     * Get one promotedProduct by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<PromotedProduct> findOne(String id) {
        log.debug("Request to get PromotedProduct : {}", id);
        return promotedProductRepository.findById(id);
    }

    /**
     * Delete the promotedProduct by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete PromotedProduct : {}", id);
        promotedProductRepository.deleteById(id);
    }
}
