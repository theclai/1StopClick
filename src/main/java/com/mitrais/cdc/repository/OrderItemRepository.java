package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.OrderItem;
import com.mitrais.cdc.domain.ShoppingCart;

import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the OrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {

}
