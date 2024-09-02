package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.Facility;
import com.system.abcrestaurant.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    boolean existsByNameAndRestaurant(String name, Restaurant restaurant);

    List<Facility> findByNameContaining(String keyword);

    List<Facility> findByRestaurantId(Long restaurantId);
}