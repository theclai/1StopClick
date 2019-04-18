package com.mitrais.cdc.service.impl;

import com.mitrais.cdc.service.ProductReviewService;
import com.mitrais.cdc.domain.ProductReview;
import com.mitrais.cdc.repository.ProductReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service Implementation for managing ProductReview.
 */
@Service
public class ProductReviewServiceImpl implements ProductReviewService {

    private final Logger log = LoggerFactory.getLogger(ProductReviewServiceImpl.class);

    private final ProductReviewRepository productReviewRepository;

    public ProductReviewServiceImpl(ProductReviewRepository productReviewRepository) {
        this.productReviewRepository = productReviewRepository;
    }

    /**
     * Save a productReview.
     *
     * @param productReview the entity to save
     * @return the persisted entity
     */
    @Override
    public ProductReview save(ProductReview productReview) {
        log.debug("Request to save ProductReview : {}", productReview);
        return productReviewRepository.save(productReview);
    }

    /**
     * Get all the productReviews.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<ProductReview> findAll(Pageable pageable) {
        log.debug("Request to get all ProductReviews");
        return productReviewRepository.findAll(pageable);
    }


    /**
     * Get one productReview by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<ProductReview> findOne(String id) {
        log.debug("Request to get ProductReview : {}", id);
        return productReviewRepository.findById(id);
    }

    /**
     * Delete the productReview by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete ProductReview : {}", id);
        productReviewRepository.deleteById(id);
    }
}
