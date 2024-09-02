package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.DineinTable;
import com.system.abcrestaurant.model.Reservation;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.model.User;
import com.system.abcrestaurant.repository.ReservationRepository;
import com.system.abcrestaurant.repository.TableRepository;
import com.system.abcrestaurant.repository.RestaurantRepository;
import com.system.abcrestaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private EmailService emailService;


    @Override
    public Reservation createReservation(Reservation reservation) throws Exception {
        // Validate and fetch Restaurant
        Restaurant restaurant = restaurantRepository.findById(reservation.getRestaurant().getId())
                .orElseThrow(() -> new Exception("Restaurant not found with id " + reservation.getRestaurant().getId()));

        // Validate and fetch User
        User user = userRepository.findById(reservation.getUser().getId())
                .orElseThrow(() -> new Exception("User not found with id " + reservation.getUser().getId()));

        // Validate and fetch DineinTable
        DineinTable dineinTable = tableRepository.findById(reservation.getDineinTable().getId())
                .orElseThrow(() -> new Exception("DineinTable not found with id " + reservation.getDineinTable().getId()));

        // Set validated objects back to reservation
        reservation.setRestaurant(restaurant);
        reservation.setUser(user);
        reservation.setDineinTable(dineinTable);

        // Check for duplicate reservation
        if (isDuplicateReservation(reservation)) {
            throw new Exception("Duplicate reservation detected.");
        }

        // Save the Reservation
        Reservation savedReservation = reservationRepository.save(reservation);

        // Send confirmation email
        emailService.sendReservationConfirmationEmail(
                user.getEmail(), savedReservation);

        return savedReservation;
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation findReservationById(Long id) throws Exception {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new Exception("Reservation not found with id " + id));
    }

    @Override
    public List<Reservation> getAllReservationsForRestaurant(Long restaurantId) {
        return List.of();
    }

    @Override
    public List<Reservation> getAllReservationsForUser(Long userId) {
        return List.of();
    }

    @Override
    public void cancelReservation(Long id) throws Exception {
        Reservation reservation = findReservationById(id);
        reservationRepository.delete(reservation);
    }

    @Override
    public boolean isDuplicateReservation(Reservation reservation) {
        List<Reservation> reservations = reservationRepository.findByDineinTable_Id(reservation.getDineinTable().getId());
        for (Reservation r : reservations) {
            if (r.getReservationTime().equals(reservation.getReservationTime()) &&
                    r.getEndTime().equals(reservation.getEndTime()) &&
                    r.getUser().equals(reservation.getUser())) {
                return true;
            }
        }
        return false;
    }

}
