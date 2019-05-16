package com.mitrais.cdc.web.rest;
import com.mitrais.cdc.domain.PromotedProduct;
import com.mitrais.cdc.service.PromotedProductService;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PromotedProduct.
 */
@RestController
@RequestMapping("/api")
public class PromotedProductResource {

    private final Logger log = LoggerFactory.getLogger(PromotedProductResource.class);

    private static final String ENTITY_NAME = "promotedProduct";

    private final PromotedProductService promotedProductService;

    public PromotedProductResource(PromotedProductService promotedProductService) {
        this.promotedProductService = promotedProductService;
    }

    /**
     * POST  /promoted-products : Create a new promotedProduct.
     *
     * @param promotedProduct the promotedProduct to create
     * @return the ResponseEntity with status 201 (Created) and with body the new promotedProduct, or with status 400 (Bad Request) if the promotedProduct has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/promoted-products")
    public ResponseEntity<PromotedProduct> createPromotedProduct(@Valid @RequestBody PromotedProduct promotedProduct) throws URISyntaxException {
        log.debug("REST request to save PromotedProduct : {}", promotedProduct);
        if (promotedProduct.getId() != null) {
            throw new BadRequestAlertException("A new promotedProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PromotedProduct result = promotedProductService.save(promotedProduct);
        return ResponseEntity.created(new URI("/api/promoted-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /promoted-products : Updates an existing promotedProduct.
     *
     * @param promotedProduct the promotedProduct to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated promotedProduct,
     * or with status 400 (Bad Request) if the promotedProduct is not valid,
     * or with status 500 (Internal Server Error) if the promotedProduct couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/promoted-products")
    public ResponseEntity<PromotedProduct> updatePromotedProduct(@Valid @RequestBody PromotedProduct promotedProduct) throws URISyntaxException {
        log.debug("REST request to update PromotedProduct : {}", promotedProduct);
        if (promotedProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PromotedProduct result = promotedProductService.save(promotedProduct);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, promotedProduct.getId().toString()))
            .body(result);
    }

    /**
     * GET  /promoted-products : get all the promotedProducts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of promotedProducts in body
     */
    @GetMapping("/promoted-products")
    public ResponseEntity<List<PromotedProduct>> getAllPromotedProducts(Pageable pageable) {
        log.debug("REST request to get a page of PromotedProducts");
        Page<PromotedProduct> page = promotedProductService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/promoted-products");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /promoted-products/:id : get the "id" promotedProduct.
     *
     * @param id the id of the promotedProduct to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the promotedProduct, or with status 404 (Not Found)
     */
    @GetMapping("/promoted-products/{id}")
    public ResponseEntity<PromotedProduct> getPromotedProduct(@PathVariable String id) {
        log.debug("REST request to get PromotedProduct : {}", id);
        Optional<PromotedProduct> promotedProduct = promotedProductService.findOne(id);
        return ResponseUtil.wrapOrNotFound(promotedProduct);
    }

    /**
     * DELETE  /promoted-products/:id : delete the "id" promotedProduct.
     *
     * @param id the id of the promotedProduct to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/promoted-products/{id}")
    public ResponseEntity<Void> deletePromotedProduct(@PathVariable String id) {
        log.debug("REST request to delete PromotedProduct : {}", id);
        promotedProductService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
