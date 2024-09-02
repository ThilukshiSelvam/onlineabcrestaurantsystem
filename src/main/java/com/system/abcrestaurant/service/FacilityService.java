package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Facility;
import com.system.abcrestaurant.request.FacilityRequest;

import java.util.List;

public interface FacilityService {

    Facility createFacility(FacilityRequest facilityRequest);

    Facility updateFacility(Long id, FacilityRequest facilityRequest);

    boolean deleteFacility(Long id);

    List<Facility> searchFacilities(String keyword);

    List<Facility> getFacilitiesByRestaurantId(Long restaurantId);

    public List<Facility> getAllFacilities();

}