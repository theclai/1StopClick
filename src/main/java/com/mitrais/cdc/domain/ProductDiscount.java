package com.mitrais.cdc.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ProductDiscount.
 */
@Document(collection = "product_discount")
public class ProductDiscount implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @Field("discount_value")
    private BigDecimal discountValue;

    @Field("discount_unit")
    private String discountUnit;

    @Field("date")
    private Instant date;

    @Field("voucher_code")
    private String voucherCode;

    @Field("minimum_order_value")
    private Integer minimumOrderValue;

    @Field("maximum_discount_value")
    private Integer maximumDiscountValue;

    @Field("is_redem_allowed")
    private Boolean isRedemAllowed;

    @DBRef
    @Field("product")
    private Set<Product> products = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public ProductDiscount discountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
        return this;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public String getDiscountUnit() {
        return discountUnit;
    }

    public ProductDiscount discountUnit(String discountUnit) {
        this.discountUnit = discountUnit;
        return this;
    }

    public void setDiscountUnit(String discountUnit) {
        this.discountUnit = discountUnit;
    }

    public Instant getDate() {
        return date;
    }

    public ProductDiscount date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public ProductDiscount voucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
        return this;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public Integer getMinimumOrderValue() {
        return minimumOrderValue;
    }

    public ProductDiscount minimumOrderValue(Integer minimumOrderValue) {
        this.minimumOrderValue = minimumOrderValue;
        return this;
    }

    public void setMinimumOrderValue(Integer minimumOrderValue) {
        this.minimumOrderValue = minimumOrderValue;
    }

    public Integer getMaximumDiscountValue() {
        return maximumDiscountValue;
    }

    public ProductDiscount maximumDiscountValue(Integer maximumDiscountValue) {
        this.maximumDiscountValue = maximumDiscountValue;
        return this;
    }

    public void setMaximumDiscountValue(Integer maximumDiscountValue) {
        this.maximumDiscountValue = maximumDiscountValue;
    }

    public Boolean isIsRedemAllowed() {
        return isRedemAllowed;
    }

    public ProductDiscount isRedemAllowed(Boolean isRedemAllowed) {
        this.isRedemAllowed = isRedemAllowed;
        return this;
    }

    public void setIsRedemAllowed(Boolean isRedemAllowed) {
        this.isRedemAllowed = isRedemAllowed;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public ProductDiscount products(Set<Product> products) {
        this.products = products;
        return this;
    }

    public ProductDiscount addProduct(Product product) {
        this.products.add(product);
        product.setProductDiscount(this);
        return this;
    }

    public ProductDiscount removeProduct(Product product) {
        this.products.remove(product);
        product.setProductDiscount(null);
        return this;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProductDiscount productDiscount = (ProductDiscount) o;
        if (productDiscount.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productDiscount.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductDiscount{" +
            "id=" + getId() +
            ", discountValue=" + getDiscountValue() +
            ", discountUnit='" + getDiscountUnit() + "'" +
            ", date='" + getDate() + "'" +
            ", voucherCode='" + getVoucherCode() + "'" +
            ", minimumOrderValue=" + getMinimumOrderValue() +
            ", maximumDiscountValue=" + getMaximumDiscountValue() +
            ", isRedemAllowed='" + isIsRedemAllowed() + "'" +
            "}";
    }
}
