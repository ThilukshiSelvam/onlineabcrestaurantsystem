package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Reservation;

public interface EmailService {
    void sendReservationConfirmationEmail(String to, Reservation reservation);
}
