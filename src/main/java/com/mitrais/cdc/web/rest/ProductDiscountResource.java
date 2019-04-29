package com.mitrais.cdc.web.rest;
import com.mitrais.cdc.domain.ProductDiscount;
import com.mitrais.cdc.service.ProductDiscountService;
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
 * REST controller for managing ProductDiscount.
 */
@RestController
@RequestMapping("/api")
public class ProductDiscountResource {

    private final Logger log = LoggerFactory.getLogger(ProductDiscountResource.class);

    private static final String ENTITY_NAME = "productDiscount";

    private final ProductDiscountService productDiscountService;

    public ProductDiscountResource(ProductDiscountService productDiscountService) {
        this.productDiscountService = productDiscountService;
    }

    /**
     * POST  /product-discounts : Create a new productDiscount.
     *
     * @param productDiscount the productDiscount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productDiscount, or with status 400 (Bad Request) if the productDiscount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-discounts")
    public ResponseEntity<ProductDiscount> createProductDiscount(@RequestBody ProductDiscount productDiscount) throws URISyntaxException {
        log.debug("REST request to save ProductDiscount : {}", productDiscount);
        if (productDiscount.getId() != null) {
            throw new BadRequestAlertException("A new productDiscount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductDiscount result = productDiscountService.save(productDiscount);
        return ResponseEntity.created(new URI("/api/product-discounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-discounts : Updates an existing productDiscount.
     *
     * @param productDiscount the productDiscount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productDiscount,
     * or with status 400 (Bad Request) if the productDiscount is not valid,
     * or with status 500 (Internal Server Error) if the productDiscount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-discounts")
    public ResponseEntity<ProductDiscount> updateProductDiscount(@RequestBody ProductDiscount productDiscount) throws URISyntaxException {
        log.debug("REST request to update ProductDiscount : {}", productDiscount);
        if (productDiscount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductDiscount result = productDiscountService.save(productDiscount);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productDiscount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-discounts : get all the productDiscounts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of productDiscounts in body
     */
    @GetMapping("/product-discounts")
    public ResponseEntity<List<ProductDiscount>> getAllProductDiscounts(Pageable pageable) {
        log.debug("REST request to get a page of ProductDiscounts");
        Page<ProductDiscount> page = productDiscountService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-discounts");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /product-discounts/:id : get the "id" productDiscount.
     *
     * @param id the id of the productDiscount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productDiscount, or with status 404 (Not Found)
     */
    @GetMapping("/product-discounts/{id}")
    public ResponseEntity<ProductDiscount> getProductDiscount(@PathVariable String id) {
        log.debug("REST request to get ProductDiscount : {}", id);
        Optional<ProductDiscount> productDiscount = productDiscountService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productDiscount);
    }

    /**
     * DELETE  /product-discounts/:id : delete the "id" productDiscount.
     *
     * @param id the id of the productDiscount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-discounts/{id}")
    public ResponseEntity<Void> deleteProductDiscount(@PathVariable String id) {
        log.debug("REST request to delete ProductDiscount : {}", id);
        productDiscountService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
