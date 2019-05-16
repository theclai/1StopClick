package com.mitrais.cdc.domain;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import com.mitrais.cdc.domain.enumeration.PromotedStatus;

/**
 * A PromotedProduct.
 */
@Document(collection = "promoted_product")
public class PromotedProduct implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @Field("created_date")
    private LocalDate createdDate;

    @NotNull
    @Field("duration")
    private Integer duration;

    @NotNull
    @Field("status")
    private PromotedStatus status;

    @DBRef
    @Field("promotedProduct")
    private Product promotedProduct;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public PromotedProduct createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getDuration() {
        return duration;
    }

    public PromotedProduct duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public PromotedStatus getStatus() {
        return status;
    }

    public PromotedProduct status(PromotedStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(PromotedStatus status) {
        this.status = status;
    }

    public Product getPromotedProduct() {
        return promotedProduct;
    }

    public PromotedProduct promotedProduct(Product product) {
        this.promotedProduct = product;
        return this;
    }

    public void setPromotedProduct(Product product) {
        this.promotedProduct = product;
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
        PromotedProduct promotedProduct = (PromotedProduct) o;
        if (promotedProduct.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), promotedProduct.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PromotedProduct{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", duration=" + getDuration() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
