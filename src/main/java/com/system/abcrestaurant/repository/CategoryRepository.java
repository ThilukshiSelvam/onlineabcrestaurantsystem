package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByRestaurantId(Long id);

    boolean existsByNameAndRestaurantId(String name, Long restaurantId);
}