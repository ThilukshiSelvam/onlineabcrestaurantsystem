package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Facility;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.repository.FacilityRepository;
import com.system.abcrestaurant.repository.RestaurantRepository;
import com.system.abcrestaurant.request.FacilityRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public Facility createFacility(FacilityRequest facilityRequest) {
        // Fetch the Restaurant entity from the repository
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(facilityRequest.getRestaurantId());
        if (restaurantOpt.isEmpty()) {
            throw new RuntimeException("Restaurant not found with ID: " + facilityRequest.getRestaurantId());
        }

        // Check for duplicate facility in the same restaurant
        if (facilityRepository.existsByNameAndRestaurant(facilityRequest.getName(), restaurantOpt.get())) {
            throw new IllegalArgumentException("Facility already exists for this restaurant");
        }

        Facility facility = new Facility();
        facility.setName(facilityRequest.getName());
        facility.setDescription(facilityRequest.getDescription());
        facility.setRestaurant(restaurantOpt.get()); // Set the fetched Restaurant entity

        return facilityRepository.save(facility);
    }

    @Override
    public Facility updateFacility(Long id, FacilityRequest facilityRequest) {
        // Fetch the existing Facility
        Optional<Facility> facilityOpt = facilityRepository.findById(id);
        if (facilityOpt.isEmpty()) {
            throw new IllegalArgumentException("Facility not found");
        }

        Facility facility = facilityOpt.get();

        // Fetch the Restaurant entity from the repository
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(facilityRequest.getRestaurantId());
        if (restaurantOpt.isEmpty()) {
            throw new RuntimeException("Restaurant not found with ID: " + facilityRequest.getRestaurantId());
        }

        // Check for duplicate facility in the same restaurant
        if (facilityRepository.existsByNameAndRestaurant(facilityRequest.getName(), restaurantOpt.get()) &&
                !facility.getName().equals(facilityRequest.getName())) {
            throw new IllegalArgumentException("Facility already exists for this restaurant");
        }

        facility.setName(facilityRequest.getName());
        facility.setDescription(facilityRequest.getDescription());
        facility.setRestaurant(restaurantOpt.get()); // Set the fetched Restaurant entity

        return facilityRepository.save(facility);
    }

    @Override
    public boolean deleteFacility(Long id) {
        Optional<Facility> facilityOpt = facilityRepository.findById(id);
        if (facilityOpt.isPresent()) {
            facilityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Facility> searchFacilities(String keyword) {
        return facilityRepository.findByNameContaining(keyword);
    }

    @Override
    public List<Facility> getFacilitiesByRestaurantId(Long restaurantId) {
        return facilityRepository.findByRestaurantId(restaurantId);
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @Override
    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id).orElse(null);
    }
}