package com.mitrais.cdc.web.rest;
import com.mitrais.cdc.domain.OwnedProduct;
import com.mitrais.cdc.service.OwnedProductService;
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
 * REST controller for managing OwnedProduct.
 */
@RestController
@RequestMapping("/api")
public class OwnedProductResource {

    private final Logger log = LoggerFactory.getLogger(OwnedProductResource.class);

    private static final String ENTITY_NAME = "ownedProduct";

    private final OwnedProductService ownedProductService;

    public OwnedProductResource(OwnedProductService ownedProductService) {
        this.ownedProductService = ownedProductService;
    }

    /**
     * POST  /owned-products : Create a new ownedProduct.
     *
     * @param ownedProduct the ownedProduct to create
     * @return the ResponseEntity with status 201 (Created) and with body the new ownedProduct, or with status 400 (Bad Request) if the ownedProduct has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/owned-products")
    public ResponseEntity<OwnedProduct> createOwnedProduct(@Valid @RequestBody OwnedProduct ownedProduct) throws URISyntaxException {
        log.debug("REST request to save OwnedProduct : {}", ownedProduct);
        if (ownedProduct.getId() != null) {
            throw new BadRequestAlertException("A new ownedProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OwnedProduct result = ownedProductService.save(ownedProduct);
        return ResponseEntity.created(new URI("/api/owned-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /owned-products : Updates an existing ownedProduct.
     *
     * @param ownedProduct the ownedProduct to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated ownedProduct,
     * or with status 400 (Bad Request) if the ownedProduct is not valid,
     * or with status 500 (Internal Server Error) if the ownedProduct couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/owned-products")
    public ResponseEntity<OwnedProduct> updateOwnedProduct(@Valid @RequestBody OwnedProduct ownedProduct) throws URISyntaxException {
        log.debug("REST request to update OwnedProduct : {}", ownedProduct);
        if (ownedProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OwnedProduct result = ownedProductService.save(ownedProduct);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, ownedProduct.getId().toString()))
            .body(result);
    }

    /**
     * GET  /owned-products : get all the ownedProducts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of ownedProducts in body
     */
    @GetMapping("/owned-products")
    public ResponseEntity<List<OwnedProduct>> getAllOwnedProducts(Pageable pageable) {
        log.debug("REST request to get a page of OwnedProducts");
        Page<OwnedProduct> page = ownedProductService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/owned-products");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /owned-products/:id : get the "id" ownedProduct.
     *
     * @param id the id of the ownedProduct to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the ownedProduct, or with status 404 (Not Found)
     */
    @GetMapping("/owned-products/{id}")
    public ResponseEntity<OwnedProduct> getOwnedProduct(@PathVariable String id) {
        log.debug("REST request to get OwnedProduct : {}", id);
        Optional<OwnedProduct> ownedProduct = ownedProductService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ownedProduct);
    }

    /**
     * DELETE  /owned-products/:id : delete the "id" ownedProduct.
     *
     * @param id the id of the ownedProduct to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/owned-products/{id}")
    public ResponseEntity<Void> deleteOwnedProduct(@PathVariable String id) {
        log.debug("REST request to delete OwnedProduct : {}", id);
        ownedProductService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
