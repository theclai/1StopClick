package com.mitrais.cdc.service.impl;

import com.mitrais.cdc.service.ProductDiscountService;
import com.mitrais.cdc.domain.ProductDiscount;
import com.mitrais.cdc.repository.ProductDiscountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service Implementation for managing ProductDiscount.
 */
@Service
public class ProductDiscountServiceImpl implements ProductDiscountService {

    private final Logger log = LoggerFactory.getLogger(ProductDiscountServiceImpl.class);

    private final ProductDiscountRepository productDiscountRepository;

    public ProductDiscountServiceImpl(ProductDiscountRepository productDiscountRepository) {
        this.productDiscountRepository = productDiscountRepository;
    }

    /**
     * Save a productDiscount.
     *
     * @param productDiscount the entity to save
     * @return the persisted entity
     */
    @Override
    public ProductDiscount save(ProductDiscount productDiscount) {
        log.debug("Request to save ProductDiscount : {}", productDiscount);
        return productDiscountRepository.save(productDiscount);
    }

    /**
     * Get all the productDiscounts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<ProductDiscount> findAll(Pageable pageable) {
        log.debug("Request to get all ProductDiscounts");
        return productDiscountRepository.findAll(pageable);
    }


    /**
     * Get one productDiscount by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<ProductDiscount> findOne(String id) {
        log.debug("Request to get ProductDiscount : {}", id);
        return productDiscountRepository.findById(id);
    }

    /**
     * Delete the productDiscount by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete ProductDiscount : {}", id);
        productDiscountRepository.deleteById(id);
    }
}
