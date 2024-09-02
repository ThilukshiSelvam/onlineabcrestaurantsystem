package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.Reservation;
import com.system.abcrestaurant.response.MessageResponse;
import com.system.abcrestaurant.service.ReservationService;
import com.system.abcrestaurant.service.EmailService; // Add this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private EmailService emailService; // Add this field

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            // Check for duplicate reservation
            if (reservationService.isDuplicateReservation(reservation)) {
                return new ResponseEntity<>(new MessageResponse("Duplicate reservation detected"), HttpStatus.CONFLICT);
            }

            // Create the reservation
            Reservation createdReservation = reservationService.createReservation(reservation);

            // Send confirmation email
            emailService.sendReservationConfirmationEmail(
                    reservation.getUser().getEmail(), createdReservation);

            return new ResponseEntity<>(createdReservation, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findReservationById(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.findReservationById(id);
            return new ResponseEntity<>(reservation, HttpStatus.OK);
        } catch (Exception e) {
            MessageResponse res = new MessageResponse();
            res.setMessage(e.getMessage());
            return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Reservation>> getAllReservationsForRestaurant(@PathVariable Long restaurantId) {
        List<Reservation> reservations = reservationService.getAllReservationsForRestaurant(restaurantId);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getAllReservationsForUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getAllReservationsForUser(userId);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }
}
