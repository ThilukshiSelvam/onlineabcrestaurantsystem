package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByRestaurantId(Long restaurantId);

    boolean existsByTitleAndRestaurantId(String title, Long restaurantId); // Custom method to check for duplicates
}
