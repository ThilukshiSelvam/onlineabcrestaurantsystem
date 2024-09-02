package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Reservation;

import java.util.List;

public interface ReservationService {


    Reservation createReservation(Reservation reservation) throws Exception;

    List<Reservation> getAllReservations();

    Reservation findReservationById(Long id) throws Exception;
    List<Reservation> getAllReservationsForRestaurant(Long restaurantId);
    List<Reservation> getAllReservationsForUser(Long userId);

    void cancelReservation(Long id) throws Exception;
    boolean isDuplicateReservation(Reservation reservation);
}