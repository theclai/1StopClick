package com.mitrais.cdc.web.rest;

import com.mitrais.cdc.Application;

import com.mitrais.cdc.domain.PromotedProduct;
import com.mitrais.cdc.domain.Product;
import com.mitrais.cdc.repository.PromotedProductRepository;
import com.mitrais.cdc.service.PromotedProductService;
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

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.mitrais.cdc.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mitrais.cdc.domain.enumeration.PromotedStatus;
/**
 * Test class for the PromotedProductResource REST controller.
 *
 * @see PromotedProductResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class PromotedProductResourceIntTest {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final PromotedStatus DEFAULT_STATUS = PromotedStatus.ACTIVE;
    private static final PromotedStatus UPDATED_STATUS = PromotedStatus.EXPIRED;

    @Autowired
    private PromotedProductRepository promotedProductRepository;

    @Autowired
    private PromotedProductService promotedProductService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restPromotedProductMockMvc;

    private PromotedProduct promotedProduct;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PromotedProductResource promotedProductResource = new PromotedProductResource(promotedProductService);
        this.restPromotedProductMockMvc = MockMvcBuilders.standaloneSetup(promotedProductResource)
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
    public static PromotedProduct createEntity() {
        PromotedProduct promotedProduct = new PromotedProduct()
            .createdDate(DEFAULT_CREATED_DATE)
            .duration(DEFAULT_DURATION)
            .status(DEFAULT_STATUS);
        // Add required entity
        Product product = ProductResourceIntTest.createEntity();
        product.setId("fixed-id-for-tests");
        promotedProduct.setPromotedProduct(product);
        return promotedProduct;
    }

    @Before
    public void initTest() {
        promotedProductRepository.deleteAll();
        promotedProduct = createEntity();
    }

    @Test
    public void createPromotedProduct() throws Exception {
        int databaseSizeBeforeCreate = promotedProductRepository.findAll().size();

        // Create the PromotedProduct
        restPromotedProductMockMvc.perform(post("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotedProduct)))
            .andExpect(status().isCreated());

        // Validate the PromotedProduct in the database
        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeCreate + 1);
        PromotedProduct testPromotedProduct = promotedProductList.get(promotedProductList.size() - 1);
        assertThat(testPromotedProduct.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testPromotedProduct.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testPromotedProduct.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    public void createPromotedProductWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = promotedProductRepository.findAll().size();

        // Create the PromotedProduct with an existing ID
        promotedProduct.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromotedProductMockMvc.perform(post("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotedProduct)))
            .andExpect(status().isBadRequest());

        // Validate the PromotedProduct in the database
        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkDurationIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotedProductRepository.findAll().size();
        // set the field null
        promotedProduct.setDuration(null);

        // Create the PromotedProduct, which fails.

        restPromotedProductMockMvc.perform(post("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotedProduct)))
            .andExpect(status().isBadRequest());

        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotedProductRepository.findAll().size();
        // set the field null
        promotedProduct.setStatus(null);

        // Create the PromotedProduct, which fails.

        restPromotedProductMockMvc.perform(post("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotedProduct)))
            .andExpect(status().isBadRequest());

        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllPromotedProducts() throws Exception {
        // Initialize the database
        promotedProductRepository.save(promotedProduct);

        // Get all the promotedProductList
        restPromotedProductMockMvc.perform(get("/api/promoted-products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promotedProduct.getId())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    public void getPromotedProduct() throws Exception {
        // Initialize the database
        promotedProductRepository.save(promotedProduct);

        // Get the promotedProduct
        restPromotedProductMockMvc.perform(get("/api/promoted-products/{id}", promotedProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(promotedProduct.getId()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    public void getNonExistingPromotedProduct() throws Exception {
        // Get the promotedProduct
        restPromotedProductMockMvc.perform(get("/api/promoted-products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updatePromotedProduct() throws Exception {
        // Initialize the database
        promotedProductService.save(promotedProduct);

        int databaseSizeBeforeUpdate = promotedProductRepository.findAll().size();

        // Update the promotedProduct
        PromotedProduct updatedPromotedProduct = promotedProductRepository.findById(promotedProduct.getId()).get();
        updatedPromotedProduct
            .createdDate(UPDATED_CREATED_DATE)
            .duration(UPDATED_DURATION)
            .status(UPDATED_STATUS);

        restPromotedProductMockMvc.perform(put("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPromotedProduct)))
            .andExpect(status().isOk());

        // Validate the PromotedProduct in the database
        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeUpdate);
        PromotedProduct testPromotedProduct = promotedProductList.get(promotedProductList.size() - 1);
        assertThat(testPromotedProduct.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testPromotedProduct.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testPromotedProduct.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    public void updateNonExistingPromotedProduct() throws Exception {
        int databaseSizeBeforeUpdate = promotedProductRepository.findAll().size();

        // Create the PromotedProduct

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromotedProductMockMvc.perform(put("/api/promoted-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotedProduct)))
            .andExpect(status().isBadRequest());

        // Validate the PromotedProduct in the database
        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deletePromotedProduct() throws Exception {
        // Initialize the database
        promotedProductService.save(promotedProduct);

        int databaseSizeBeforeDelete = promotedProductRepository.findAll().size();

        // Delete the promotedProduct
        restPromotedProductMockMvc.perform(delete("/api/promoted-products/{id}", promotedProduct.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PromotedProduct> promotedProductList = promotedProductRepository.findAll();
        assertThat(promotedProductList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PromotedProduct.class);
        PromotedProduct promotedProduct1 = new PromotedProduct();
        promotedProduct1.setId("id1");
        PromotedProduct promotedProduct2 = new PromotedProduct();
        promotedProduct2.setId(promotedProduct1.getId());
        assertThat(promotedProduct1).isEqualTo(promotedProduct2);
        promotedProduct2.setId("id2");
        assertThat(promotedProduct1).isNotEqualTo(promotedProduct2);
        promotedProduct1.setId(null);
        assertThat(promotedProduct1).isNotEqualTo(promotedProduct2);
    }
}
