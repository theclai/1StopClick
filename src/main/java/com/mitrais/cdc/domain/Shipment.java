package com.mitrais.cdc.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Shipment.
 */
@Document(collection = "shipment")
public class Shipment implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private String id;

    @Field("tracking_code")
    private String trackingCode;

    @DBRef
    @Field("invoice")
    @JsonIgnoreProperties("shipments")
    private Invoice invoice;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTrackingCode() {
        return trackingCode;
    }

    public Shipment trackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
        return this;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public Shipment invoice(Invoice invoice) {
        this.invoice = invoice;
        return this;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
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
        Shipment shipment = (Shipment) o;
        if (shipment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shipment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Shipment{" +
            "id=" + getId() +
            ", trackingCode='" + getTrackingCode() + "'" +
            "}";
    }
}
