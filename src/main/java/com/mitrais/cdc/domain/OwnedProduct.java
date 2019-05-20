package com.mitrais.cdc.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A OwnedProduct.
 */
@Document(collection = "owned_product")
public class OwnedProduct implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @DBRef
    @Field("user")
    private User user;

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

    public User getUser() {
        return user;
    }

    public OwnedProduct user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public OwnedProduct products(Set<Product> products) {
        this.products = products;
        return this;
    }

//    public OwnedProduct addProduct(Product product) {
//        this.products.add(product);
//        product.setProduct(this);
//        return this;
//    }
//
//    public OwnedProduct removeProduct(Product product) {
//        this.products.remove(product);
//        product.setProduct(null);
//        return this;
//    }

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
        OwnedProduct ownedProduct = (OwnedProduct) o;
        if (ownedProduct.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ownedProduct.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OwnedProduct{" +
            "id=" + getId() +
            "}";
    }
}
