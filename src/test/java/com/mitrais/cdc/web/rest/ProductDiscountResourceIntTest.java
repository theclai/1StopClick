package com.mitrais.cdc.web.rest;

import com.mitrais.cdc.Application;

import com.mitrais.cdc.domain.ProductDiscount;
import com.mitrais.cdc.repository.ProductDiscountRepository;
import com.mitrais.cdc.service.ProductDiscountService;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.mitrais.cdc.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProductDiscountResource REST controller.
 *
 * @see ProductDiscountResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class ProductDiscountResourceIntTest {

    private static final BigDecimal DEFAULT_DISCOUNT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_DISCOUNT_VALUE = new BigDecimal(2);

    private static final String DEFAULT_DISCOUNT_UNIT = "AAAAAAAAAA";
    private static final String UPDATED_DISCOUNT_UNIT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_VOUCHER_CODE = "AAAAAAAAAA";
    private static final String UPDATED_VOUCHER_CODE = "BBBBBBBBBB";

    private static final Integer DEFAULT_MINIMUM_ORDER_VALUE = 1;
    private static final Integer UPDATED_MINIMUM_ORDER_VALUE = 2;

    private static final Integer DEFAULT_MAXIMUM_DISCOUNT_VALUE = 1;
    private static final Integer UPDATED_MAXIMUM_DISCOUNT_VALUE = 2;

    private static final Boolean DEFAULT_IS_REDEM_ALLOWED = false;
    private static final Boolean UPDATED_IS_REDEM_ALLOWED = true;

    @Autowired
    private ProductDiscountRepository productDiscountRepository;

    @Autowired
    private ProductDiscountService productDiscountService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restProductDiscountMockMvc;

    private ProductDiscount productDiscount;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductDiscountResource productDiscountResource = new ProductDiscountResource(productDiscountService);
        this.restProductDiscountMockMvc = MockMvcBuilders.standaloneSetup(productDiscountResource)
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
    public static ProductDiscount createEntity() {
        ProductDiscount productDiscount = new ProductDiscount()
            .discountValue(DEFAULT_DISCOUNT_VALUE)
            .discountUnit(DEFAULT_DISCOUNT_UNIT)
            .date(DEFAULT_DATE)
            .voucherCode(DEFAULT_VOUCHER_CODE)
            .minimumOrderValue(DEFAULT_MINIMUM_ORDER_VALUE)
            .maximumDiscountValue(DEFAULT_MAXIMUM_DISCOUNT_VALUE)
            .isRedemAllowed(DEFAULT_IS_REDEM_ALLOWED);
        return productDiscount;
    }

    @Before
    public void initTest() {
        productDiscountRepository.deleteAll();
        productDiscount = createEntity();
    }

    @Test
    public void createProductDiscount() throws Exception {
        int databaseSizeBeforeCreate = productDiscountRepository.findAll().size();

        // Create the ProductDiscount
        restProductDiscountMockMvc.perform(post("/api/product-discounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDiscount)))
            .andExpect(status().isCreated());

        // Validate the ProductDiscount in the database
        List<ProductDiscount> productDiscountList = productDiscountRepository.findAll();
        assertThat(productDiscountList).hasSize(databaseSizeBeforeCreate + 1);
        ProductDiscount testProductDiscount = productDiscountList.get(productDiscountList.size() - 1);
        assertThat(testProductDiscount.getDiscountValue()).isEqualTo(DEFAULT_DISCOUNT_VALUE);
        assertThat(testProductDiscount.getDiscountUnit()).isEqualTo(DEFAULT_DISCOUNT_UNIT);
        assertThat(testProductDiscount.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProductDiscount.getVoucherCode()).isEqualTo(DEFAULT_VOUCHER_CODE);
        assertThat(testProductDiscount.getMinimumOrderValue()).isEqualTo(DEFAULT_MINIMUM_ORDER_VALUE);
        assertThat(testProductDiscount.getMaximumDiscountValue()).isEqualTo(DEFAULT_MAXIMUM_DISCOUNT_VALUE);
        assertThat(testProductDiscount.isIsRedemAllowed()).isEqualTo(DEFAULT_IS_REDEM_ALLOWED);
    }

    @Test
    public void createProductDiscountWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productDiscountRepository.findAll().size();

        // Create the ProductDiscount with an existing ID
        productDiscount.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductDiscountMockMvc.perform(post("/api/product-discounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDiscount)))
            .andExpect(status().isBadRequest());

        // Validate the ProductDiscount in the database
        List<ProductDiscount> productDiscountList = productDiscountRepository.findAll();
        assertThat(productDiscountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllProductDiscounts() throws Exception {
        // Initialize the database
        productDiscountRepository.save(productDiscount);

        // Get all the productDiscountList
        restProductDiscountMockMvc.perform(get("/api/product-discounts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productDiscount.getId())))
            .andExpect(jsonPath("$.[*].discountValue").value(hasItem(DEFAULT_DISCOUNT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].discountUnit").value(hasItem(DEFAULT_DISCOUNT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].voucherCode").value(hasItem(DEFAULT_VOUCHER_CODE.toString())))
            .andExpect(jsonPath("$.[*].minimumOrderValue").value(hasItem(DEFAULT_MINIMUM_ORDER_VALUE)))
            .andExpect(jsonPath("$.[*].maximumDiscountValue").value(hasItem(DEFAULT_MAXIMUM_DISCOUNT_VALUE)))
            .andExpect(jsonPath("$.[*].isRedemAllowed").value(hasItem(DEFAULT_IS_REDEM_ALLOWED.booleanValue())));
    }
    
    @Test
    public void getProductDiscount() throws Exception {
        // Initialize the database
        productDiscountRepository.save(productDiscount);

        // Get the productDiscount
        restProductDiscountMockMvc.perform(get("/api/product-discounts/{id}", productDiscount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productDiscount.getId()))
            .andExpect(jsonPath("$.discountValue").value(DEFAULT_DISCOUNT_VALUE.intValue()))
            .andExpect(jsonPath("$.discountUnit").value(DEFAULT_DISCOUNT_UNIT.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.voucherCode").value(DEFAULT_VOUCHER_CODE.toString()))
            .andExpect(jsonPath("$.minimumOrderValue").value(DEFAULT_MINIMUM_ORDER_VALUE))
            .andExpect(jsonPath("$.maximumDiscountValue").value(DEFAULT_MAXIMUM_DISCOUNT_VALUE))
            .andExpect(jsonPath("$.isRedemAllowed").value(DEFAULT_IS_REDEM_ALLOWED.booleanValue()));
    }

    @Test
    public void getNonExistingProductDiscount() throws Exception {
        // Get the productDiscount
        restProductDiscountMockMvc.perform(get("/api/product-discounts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateProductDiscount() throws Exception {
        // Initialize the database
        productDiscountService.save(productDiscount);

        int databaseSizeBeforeUpdate = productDiscountRepository.findAll().size();

        // Update the productDiscount
        ProductDiscount updatedProductDiscount = productDiscountRepository.findById(productDiscount.getId()).get();
        updatedProductDiscount
            .discountValue(UPDATED_DISCOUNT_VALUE)
            .discountUnit(UPDATED_DISCOUNT_UNIT)
            .date(UPDATED_DATE)
            .voucherCode(UPDATED_VOUCHER_CODE)
            .minimumOrderValue(UPDATED_MINIMUM_ORDER_VALUE)
            .maximumDiscountValue(UPDATED_MAXIMUM_DISCOUNT_VALUE)
            .isRedemAllowed(UPDATED_IS_REDEM_ALLOWED);

        restProductDiscountMockMvc.perform(put("/api/product-discounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductDiscount)))
            .andExpect(status().isOk());

        // Validate the ProductDiscount in the database
        List<ProductDiscount> productDiscountList = productDiscountRepository.findAll();
        assertThat(productDiscountList).hasSize(databaseSizeBeforeUpdate);
        ProductDiscount testProductDiscount = productDiscountList.get(productDiscountList.size() - 1);
        assertThat(testProductDiscount.getDiscountValue()).isEqualTo(UPDATED_DISCOUNT_VALUE);
        assertThat(testProductDiscount.getDiscountUnit()).isEqualTo(UPDATED_DISCOUNT_UNIT);
        assertThat(testProductDiscount.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductDiscount.getVoucherCode()).isEqualTo(UPDATED_VOUCHER_CODE);
        assertThat(testProductDiscount.getMinimumOrderValue()).isEqualTo(UPDATED_MINIMUM_ORDER_VALUE);
        assertThat(testProductDiscount.getMaximumDiscountValue()).isEqualTo(UPDATED_MAXIMUM_DISCOUNT_VALUE);
        assertThat(testProductDiscount.isIsRedemAllowed()).isEqualTo(UPDATED_IS_REDEM_ALLOWED);
    }

    @Test
    public void updateNonExistingProductDiscount() throws Exception {
        int databaseSizeBeforeUpdate = productDiscountRepository.findAll().size();

        // Create the ProductDiscount

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductDiscountMockMvc.perform(put("/api/product-discounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDiscount)))
            .andExpect(status().isBadRequest());

        // Validate the ProductDiscount in the database
        List<ProductDiscount> productDiscountList = productDiscountRepository.findAll();
        assertThat(productDiscountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deleteProductDiscount() throws Exception {
        // Initialize the database
        productDiscountService.save(productDiscount);

        int databaseSizeBeforeDelete = productDiscountRepository.findAll().size();

        // Delete the productDiscount
        restProductDiscountMockMvc.perform(delete("/api/product-discounts/{id}", productDiscount.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductDiscount> productDiscountList = productDiscountRepository.findAll();
        assertThat(productDiscountList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductDiscount.class);
        ProductDiscount productDiscount1 = new ProductDiscount();
        productDiscount1.setId("id1");
        ProductDiscount productDiscount2 = new ProductDiscount();
        productDiscount2.setId(productDiscount1.getId());
        assertThat(productDiscount1).isEqualTo(productDiscount2);
        productDiscount2.setId("id2");
        assertThat(productDiscount1).isNotEqualTo(productDiscount2);
        productDiscount1.setId(null);
        assertThat(productDiscount1).isNotEqualTo(productDiscount2);
    }
}
