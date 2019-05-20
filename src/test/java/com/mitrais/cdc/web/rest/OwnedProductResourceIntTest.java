package com.mitrais.cdc.web.rest;

import com.mitrais.cdc.Application;

import com.mitrais.cdc.domain.OwnedProduct;
import com.mitrais.cdc.domain.User;
import com.mitrais.cdc.repository.OwnedProductRepository;
import com.mitrais.cdc.service.OwnedProductService;
import com.mitrais.cdc.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;

import java.util.List;


import static com.mitrais.cdc.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the OwnedProductResource REST controller.
 *
 * @see OwnedProductResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class OwnedProductResourceIntTest {

    @Autowired
    private OwnedProductRepository ownedProductRepository;

    @Autowired
    private OwnedProductService ownedProductService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restOwnedProductMockMvc;

    private OwnedProduct ownedProduct;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OwnedProductResource ownedProductResource = new OwnedProductResource(ownedProductService);
        this.restOwnedProductMockMvc = MockMvcBuilders.standaloneSetup(ownedProductResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OwnedProduct createEntity() {
        OwnedProduct ownedProduct = new OwnedProduct();
        // Add required entity
        User user = UserResourceIntTest.createEntity();
        user.setId("fixed-id-for-tests");
        ownedProduct.setUser(user);
        return ownedProduct;
    }

    @Before
    public void initTest() {
        ownedProductRepository.deleteAll();
        ownedProduct = createEntity();
    }

    @Test
    public void createOwnedProduct() throws Exception {
        int databaseSizeBeforeCreate = ownedProductRepository.findAll().size();

        // Create the OwnedProduct
        restOwnedProductMockMvc.perform(post("/api/owned-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ownedProduct)))
            .andExpect(status().isCreated());

        // Validate the OwnedProduct in the database
        List<OwnedProduct> ownedProductList = ownedProductRepository.findAll();
        assertThat(ownedProductList).hasSize(databaseSizeBeforeCreate + 1);
        OwnedProduct testOwnedProduct = ownedProductList.get(ownedProductList.size() - 1);
    }

    @Test
    public void createOwnedProductWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = ownedProductRepository.findAll().size();

        // Create the OwnedProduct with an existing ID
        ownedProduct.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restOwnedProductMockMvc.perform(post("/api/owned-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ownedProduct)))
            .andExpect(status().isBadRequest());

        // Validate the OwnedProduct in the database
        List<OwnedProduct> ownedProductList = ownedProductRepository.findAll();
        assertThat(ownedProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllOwnedProducts() throws Exception {
        // Initialize the database
        ownedProductRepository.save(ownedProduct);

        // Get all the ownedProductList
        restOwnedProductMockMvc.perform(get("/api/owned-products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ownedProduct.getId())));
    }
    
    @Test
    public void getOwnedProduct() throws Exception {
        // Initialize the database
        ownedProductRepository.save(ownedProduct);

        // Get the ownedProduct
        restOwnedProductMockMvc.perform(get("/api/owned-products/{id}", ownedProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(ownedProduct.getId()));
    }

    @Test
    public void getNonExistingOwnedProduct() throws Exception {
        // Get the ownedProduct
        restOwnedProductMockMvc.perform(get("/api/owned-products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateOwnedProduct() throws Exception {
        // Initialize the database
        ownedProductService.save(ownedProduct);

        int databaseSizeBeforeUpdate = ownedProductRepository.findAll().size();

        // Update the ownedProduct
        OwnedProduct updatedOwnedProduct = ownedProductRepository.findById(ownedProduct.getId()).get();

        restOwnedProductMockMvc.perform(put("/api/owned-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOwnedProduct)))
            .andExpect(status().isOk());

        // Validate the OwnedProduct in the database
        List<OwnedProduct> ownedProductList = ownedProductRepository.findAll();
        assertThat(ownedProductList).hasSize(databaseSizeBeforeUpdate);
        OwnedProduct testOwnedProduct = ownedProductList.get(ownedProductList.size() - 1);
    }

    @Test
    public void updateNonExistingOwnedProduct() throws Exception {
        int databaseSizeBeforeUpdate = ownedProductRepository.findAll().size();

        // Create the OwnedProduct

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOwnedProductMockMvc.perform(put("/api/owned-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ownedProduct)))
            .andExpect(status().isBadRequest());

        // Validate the OwnedProduct in the database
        List<OwnedProduct> ownedProductList = ownedProductRepository.findAll();
        assertThat(ownedProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deleteOwnedProduct() throws Exception {
        // Initialize the database
        ownedProductService.save(ownedProduct);

        int databaseSizeBeforeDelete = ownedProductRepository.findAll().size();

        // Delete the ownedProduct
        restOwnedProductMockMvc.perform(delete("/api/owned-products/{id}", ownedProduct.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OwnedProduct> ownedProductList = ownedProductRepository.findAll();
        assertThat(ownedProductList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OwnedProduct.class);
        OwnedProduct ownedProduct1 = new OwnedProduct();
        ownedProduct1.setId("id1");
        OwnedProduct ownedProduct2 = new OwnedProduct();
        ownedProduct2.setId(ownedProduct1.getId());
        assertThat(ownedProduct1).isEqualTo(ownedProduct2);
        ownedProduct2.setId("id2");
        assertThat(ownedProduct1).isNotEqualTo(ownedProduct2);
        ownedProduct1.setId(null);
        assertThat(ownedProduct1).isNotEqualTo(ownedProduct2);
    }
}
