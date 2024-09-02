package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.DineinTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<DineinTable, Long> {
    boolean existsByRestaurantIdAndTableNumber(Long restaurantId, Integer tableNumber);
}