package com.mitrais.cdc.web.rest;

import com.mitrais.cdc.Application;

import com.mitrais.cdc.domain.ProductReview;
import com.mitrais.cdc.repository.ProductReviewRepository;
import com.mitrais.cdc.service.ProductReviewService;
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

/**
 * Test class for the ProductReviewResource REST controller.
 *
 * @see ProductReviewResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class ProductReviewResourceIntTest {

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_IP_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_IP_ADDRESS = "BBBBBBBBBB";

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private ProductReviewService productReviewService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restProductReviewMockMvc;

    private ProductReview productReview;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductReviewResource productReviewResource = new ProductReviewResource(productReviewService);
        this.restProductReviewMockMvc = MockMvcBuilders.standaloneSetup(productReviewResource)
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
    public static ProductReview createEntity() {
        ProductReview productReview = new ProductReview()
            .rating(DEFAULT_RATING)
            .date(DEFAULT_DATE)
            .ipAddress(DEFAULT_IP_ADDRESS);
        return productReview;
    }

    @Before
    public void initTest() {
        productReviewRepository.deleteAll();
        productReview = createEntity();
    }

    @Test
    public void createProductReview() throws Exception {
        int databaseSizeBeforeCreate = productReviewRepository.findAll().size();

        // Create the ProductReview
        restProductReviewMockMvc.perform(post("/api/product-reviews")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productReview)))
            .andExpect(status().isCreated());

        // Validate the ProductReview in the database
        List<ProductReview> productReviewList = productReviewRepository.findAll();
        assertThat(productReviewList).hasSize(databaseSizeBeforeCreate + 1);
        ProductReview testProductReview = productReviewList.get(productReviewList.size() - 1);
        assertThat(testProductReview.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testProductReview.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProductReview.getIpAddress()).isEqualTo(DEFAULT_IP_ADDRESS);
    }

    @Test
    public void createProductReviewWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productReviewRepository.findAll().size();

        // Create the ProductReview with an existing ID
        productReview.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductReviewMockMvc.perform(post("/api/product-reviews")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productReview)))
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        List<ProductReview> productReviewList = productReviewRepository.findAll();
        assertThat(productReviewList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllProductReviews() throws Exception {
        // Initialize the database
        productReviewRepository.save(productReview);

        // Get all the productReviewList
        restProductReviewMockMvc.perform(get("/api/product-reviews?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productReview.getId())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].ipAddress").value(hasItem(DEFAULT_IP_ADDRESS.toString())));
    }
    
    @Test
    public void getProductReview() throws Exception {
        // Initialize the database
        productReviewRepository.save(productReview);

        // Get the productReview
        restProductReviewMockMvc.perform(get("/api/product-reviews/{id}", productReview.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productReview.getId()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.ipAddress").value(DEFAULT_IP_ADDRESS.toString()));
    }

    @Test
    public void getNonExistingProductReview() throws Exception {
        // Get the productReview
        restProductReviewMockMvc.perform(get("/api/product-reviews/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateProductReview() throws Exception {
        // Initialize the database
        productReviewService.save(productReview);

        int databaseSizeBeforeUpdate = productReviewRepository.findAll().size();

        // Update the productReview
        ProductReview updatedProductReview = productReviewRepository.findById(productReview.getId()).get();
        updatedProductReview
            .rating(UPDATED_RATING)
            .date(UPDATED_DATE)
            .ipAddress(UPDATED_IP_ADDRESS);

        restProductReviewMockMvc.perform(put("/api/product-reviews")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductReview)))
            .andExpect(status().isOk());

        // Validate the ProductReview in the database
        List<ProductReview> productReviewList = productReviewRepository.findAll();
        assertThat(productReviewList).hasSize(databaseSizeBeforeUpdate);
        ProductReview testProductReview = productReviewList.get(productReviewList.size() - 1);
        assertThat(testProductReview.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testProductReview.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductReview.getIpAddress()).isEqualTo(UPDATED_IP_ADDRESS);
    }

    @Test
    public void updateNonExistingProductReview() throws Exception {
        int databaseSizeBeforeUpdate = productReviewRepository.findAll().size();

        // Create the ProductReview

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductReviewMockMvc.perform(put("/api/product-reviews")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productReview)))
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        List<ProductReview> productReviewList = productReviewRepository.findAll();
        assertThat(productReviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deleteProductReview() throws Exception {
        // Initialize the database
        productReviewService.save(productReview);

        int databaseSizeBeforeDelete = productReviewRepository.findAll().size();

        // Delete the productReview
        restProductReviewMockMvc.perform(delete("/api/product-reviews/{id}", productReview.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductReview> productReviewList = productReviewRepository.findAll();
        assertThat(productReviewList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductReview.class);
        ProductReview productReview1 = new ProductReview();
        productReview1.setId("id1");
        ProductReview productReview2 = new ProductReview();
        productReview2.setId(productReview1.getId());
        assertThat(productReview1).isEqualTo(productReview2);
        productReview2.setId("id2");
        assertThat(productReview1).isNotEqualTo(productReview2);
        productReview1.setId(null);
        assertThat(productReview1).isNotEqualTo(productReview2);
    }
}
