package com.mitrais.cdc.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.mitrais.cdc.domain.enumeration.OrderStatus;

/**
 * A ProductOrder.
 */
@Document(collection = "product_order")
public class ProductOrder implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @Field("place_date")
    private Instant placeDate;

    @Field("status")
    private OrderStatus status;

    @Field("code")
    private String code;

    @DBRef
    @Field("orderItem")
    private Set<OrderItem> orderItems = new HashSet<>();
    @DBRef
    @Field("invoice")
    private Set<Invoice> invoices = new HashSet<>();
    @DBRef
    @Field("users")
    private Set<User> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getPlaceDate() {
        return placeDate;
    }

    public ProductOrder placeDate(Instant placeDate) {
        this.placeDate = placeDate;
        return this;
    }

    public void setPlaceDate(Instant placeDate) {
        this.placeDate = placeDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public ProductOrder status(OrderStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public ProductOrder code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public ProductOrder orderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
        return this;
    }

    public ProductOrder addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        orderItem.setProductOrder(this);
        return this;
    }

    public ProductOrder removeOrderItem(OrderItem orderItem) {
        this.orderItems.remove(orderItem);
        orderItem.setProductOrder(null);
        return this;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Set<Invoice> getInvoices() {
        return invoices;
    }

    public ProductOrder invoices(Set<Invoice> invoices) {
        this.invoices = invoices;
        return this;
    }

    public ProductOrder addInvoice(Invoice invoice) {
        this.invoices.add(invoice);
        invoice.setProductOrder(this);
        return this;
    }

    public ProductOrder removeInvoice(Invoice invoice) {
        this.invoices.remove(invoice);
        invoice.setProductOrder(null);
        return this;
    }

    public void setInvoices(Set<Invoice> invoices) {
        this.invoices = invoices;
    }

    public Set<User> getUsers() {
        return users;
    }

    public ProductOrder users(Set<User> users) {
        this.users = users;
        return this;
    }

    public ProductOrder addUser(User user) {
        this.users.add(user);
        return this;
    }

    public ProductOrder removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
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
        ProductOrder productOrder = (ProductOrder) o;
        if (productOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductOrder{" +
            "id=" + getId() +
            ", placeDate='" + getPlaceDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
