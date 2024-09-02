package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByRestaurantId(Long restaurantId);
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByDineinTable_Id(Long dineinTableId);
    // Add this method
}