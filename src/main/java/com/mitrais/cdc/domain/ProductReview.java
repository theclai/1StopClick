package com.mitrais.cdc.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A ProductReview.
 */
@Document(collection = "product_review")
public class ProductReview implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @Field("rating")
    private Integer rating;

    @Field("date")
    private LocalDate date;

    @Field("ip_address")
    private String ipAddress;

    @DBRef
    @Field("product")
    @JsonIgnoreProperties("productReviews")
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public ProductReview rating(Integer rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDate getDate() {
        return date;
    }

    public ProductReview date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public ProductReview ipAddress(String ipAddress) {
        this.ipAddress = ipAddress;
        return this;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Product getProduct() {
        return product;
    }

    public ProductReview product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
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
        ProductReview productReview = (ProductReview) o;
        if (productReview.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productReview.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductReview{" +
            "id=" + getId() +
            ", rating=" + getRating() +
            ", date='" + getDate() + "'" +
            ", ipAddress='" + getIpAddress() + "'" +
            "}";
    }
}
