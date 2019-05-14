package com.mitrais.cdc.web.rest;
import com.mitrais.cdc.domain.ShoppingCart;
import com.mitrais.cdc.domain.User;
import com.mitrais.cdc.service.ShoppingCartService;
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
 * REST controller for managing ShoppingCart.
 */
@RestController
@RequestMapping("/api")
public class ShoppingCartResource {

    private final Logger log = LoggerFactory.getLogger(ShoppingCartResource.class);

    private static final String ENTITY_NAME = "shoppingCart";

    private final ShoppingCartService shoppingCartService;

    public ShoppingCartResource(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    /**
     * POST  /shopping-carts : Create a new shoppingCart.
     *
     * @param shoppingCart the shoppingCart to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shoppingCart, or with status 400 (Bad Request) if the shoppingCart has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shopping-carts")
    public ResponseEntity<ShoppingCart> createShoppingCart(@Valid @RequestBody ShoppingCart shoppingCart) throws URISyntaxException {
        log.debug("REST request to save ShoppingCart : {}", shoppingCart);
        if (shoppingCart.getId() != null) {
            throw new BadRequestAlertException("A new shoppingCart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShoppingCart result = shoppingCartService.save(shoppingCart);
        return ResponseEntity.created(new URI("/api/shopping-carts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shopping-carts : Updates an existing shoppingCart.
     *
     * @param shoppingCart the shoppingCart to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shoppingCart,
     * or with status 400 (Bad Request) if the shoppingCart is not valid,
     * or with status 500 (Internal Server Error) if the shoppingCart couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shopping-carts")
    public ResponseEntity<ShoppingCart> updateShoppingCart(@Valid @RequestBody ShoppingCart shoppingCart) throws URISyntaxException {
        log.debug("REST request to update ShoppingCart : {}", shoppingCart);
        if (shoppingCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        ShoppingCart result = shoppingCartService.save(shoppingCart);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shoppingCart.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shopping-carts : get all the shoppingCarts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shoppingCarts in body
     */
    @GetMapping("/shopping-carts")
    public ResponseEntity<List<ShoppingCart>> getAllShoppingCarts(Pageable pageable) {
        log.debug("REST request to get a page of ShoppingCarts");
        Page<ShoppingCart> page = shoppingCartService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shopping-carts");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /shopping-carts/:id : get the "id" shoppingCart.
     *
     * @param id the id of the shoppingCart to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shoppingCart, or with status 404 (Not Found)
     */
    @GetMapping("/shopping-carts/{id}")
    public ResponseEntity<ShoppingCart> getShoppingCart(@PathVariable String id) {
        log.debug("REST request to get ShoppingCart : {}", id);
        Optional<ShoppingCart> shoppingCart = shoppingCartService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shoppingCart);
    }

    /**
     * DELETE  /shopping-carts/:id : delete the "id" shoppingCart.
     *
     * @param id the id of the shoppingCart to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shopping-carts/{id}")
    public ResponseEntity<Void> deleteShoppingCart(@PathVariable String id) {
        log.debug("REST request to delete ShoppingCart : {}", id);
        shoppingCartService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
