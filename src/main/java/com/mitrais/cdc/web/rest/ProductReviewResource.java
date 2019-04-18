package com.mitrais.cdc.web.rest;
import com.mitrais.cdc.domain.ProductReview;
import com.mitrais.cdc.service.ProductReviewService;
import com.mitrais.cdc.web.rest.errors.BadRequestAlertException;
import com.mitrais.cdc.web.rest.util.HeaderUtil;
import com.mitrais.cdc.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ProductReview.
 */
@RestController
@RequestMapping("/api")
public class ProductReviewResource {

    private final Logger log = LoggerFactory.getLogger(ProductReviewResource.class);

    private static final String ENTITY_NAME = "productReview";

    private final ProductReviewService productReviewService;

    public ProductReviewResource(ProductReviewService productReviewService) {
        this.productReviewService = productReviewService;
    }

    /**
     * POST  /product-reviews : Create a new productReview.
     *
     * @param productReview the productReview to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productReview, or with status 400 (Bad Request) if the productReview has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-reviews")
    public ResponseEntity<ProductReview> createProductReview(@RequestBody ProductReview productReview) throws URISyntaxException {
        log.debug("REST request to save ProductReview : {}", productReview);
        if (productReview.getId() != null) {
            throw new BadRequestAlertException("A new productReview cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductReview result = productReviewService.save(productReview);
        return ResponseEntity.created(new URI("/api/product-reviews/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-reviews : Updates an existing productReview.
     *
     * @param productReview the productReview to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productReview,
     * or with status 400 (Bad Request) if the productReview is not valid,
     * or with status 500 (Internal Server Error) if the productReview couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-reviews")
    public ResponseEntity<ProductReview> updateProductReview(@RequestBody ProductReview productReview) throws URISyntaxException {
        log.debug("REST request to update ProductReview : {}", productReview);
        if (productReview.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductReview result = productReviewService.save(productReview);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productReview.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-reviews : get all the productReviews.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of productReviews in body
     */
    @GetMapping("/product-reviews")
    public ResponseEntity<List<ProductReview>> getAllProductReviews(Pageable pageable) {
        log.debug("REST request to get a page of ProductReviews");
        Page<ProductReview> page = productReviewService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-reviews");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /product-reviews/:id : get the "id" productReview.
     *
     * @param id the id of the productReview to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productReview, or with status 404 (Not Found)
     */
    @GetMapping("/product-reviews/{id}")
    public ResponseEntity<ProductReview> getProductReview(@PathVariable String id) {
        log.debug("REST request to get ProductReview : {}", id);
        Optional<ProductReview> productReview = productReviewService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productReview);
    }

    /**
     * DELETE  /product-reviews/:id : delete the "id" productReview.
     *
     * @param id the id of the productReview to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-reviews/{id}")
    public ResponseEntity<Void> deleteProductReview(@PathVariable String id) {
        log.debug("REST request to delete ProductReview : {}", id);
        productReviewService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
