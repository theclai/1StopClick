package com.mitrais.cdc.repository;

import com.mitrais.cdc.domain.ProductOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the ProductOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductOrderRepository extends MongoRepository<ProductOrder, String> {
    @Query("{}")
    Page<ProductOrder> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<ProductOrder> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<ProductOrder> findOneWithEagerRelationships(String id);

}
