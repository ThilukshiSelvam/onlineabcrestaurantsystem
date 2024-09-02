package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.DineinTable;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.model.Reservation;
import com.system.abcrestaurant.repository.TableRepository;
import com.system.abcrestaurant.repository.ReservationRepository;
import com.system.abcrestaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TableServiceImpl implements TableService {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public DineinTable save(DineinTable dineinTable) {
        return tableRepository.save(dineinTable);
    }

    @Override
    public DineinTable createDineinTable(DineinTable dineinTable) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(dineinTable.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id " + dineinTable.getRestaurantId()));

        if (isTableDuplicate(dineinTable.getRestaurantId(), dineinTable.getTableNumber())) {
            throw new Exception("Table with the same number already exists in this restaurant");
        }

        dineinTable.setRestaurantId(restaurant.getId());
        return save(dineinTable);
    }

    @Override
    public DineinTable findTableById(Long id) throws Exception {
        return tableRepository.findById(id)
                .orElseThrow(() -> new Exception("DineinTable not found with id " + id));
    }

    @Override
    public List<DineinTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    public void updateTableAvailability(Long id, boolean isAvailable) throws Exception {
        DineinTable dineinTable = findTableById(id);
        dineinTable.setAvailable(isAvailable);
        save(dineinTable);
    }

    @Override
    public boolean isTableAvailable(Long tableId, LocalDateTime reservationTime, int duration) throws Exception {
        DineinTable dineinTable = findTableById(tableId);

        if (dineinTable == null || !dineinTable.isAvailable()) {
            return false;
        }

        LocalDateTime endTime = reservationTime.plusHours(duration);

        List<Reservation> reservations = reservationRepository.findByDineinTable_Id(tableId);
        for (Reservation reservation : reservations) {
            if (reservation.getReservationTime().isBefore(endTime) && reservation.getEndTime().isAfter(reservationTime)) {
                return false;
            }
        }

        return true;
    }

    public DineinTable updateDineinTable(Long id, DineinTable updatedTable) throws Exception {
        DineinTable existingTable = findTableById(id);

        existingTable.setRestaurantId(updatedTable.getRestaurantId());
        existingTable.setTableNumber(updatedTable.getTableNumber());
        existingTable.setSeats(updatedTable.getSeats());
        existingTable.setAvailable(updatedTable.isAvailable());

        return tableRepository.save(existingTable);
    }

    @Override
    public boolean isTableDuplicate(Long restaurantId, Integer tableNumber) {
        return tableRepository.existsByRestaurantIdAndTableNumber(restaurantId, tableNumber);
    }

    @Override
    public void deleteTable(Long id) throws Exception {
        DineinTable dineinTable = findTableById(id);
        if (dineinTable == null) {
            throw new Exception("DineinTable not found with id " + id);
        }
        tableRepository.delete(dineinTable);
    }
}