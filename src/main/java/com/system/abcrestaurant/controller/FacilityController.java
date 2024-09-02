package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.Facility;
import com.system.abcrestaurant.response.ApiResponse;
import com.system.abcrestaurant.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facility")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchFacilities(@RequestParam String keyword) {
        ApiResponse response = new ApiResponse();

        if (keyword == null || keyword.trim().isEmpty()) {
            response.setMessage("Search keyword is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        List<Facility> facilities = facilityService.searchFacilities(keyword);
        response.setMessage("Facilities retrieved successfully");
        response.setData(facilities);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse> getRestaurantFacilities(@PathVariable Long restaurantId) {
        ApiResponse response = new ApiResponse();

        if (restaurantId == null) {
            response.setMessage("Restaurant ID is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        List<Facility> facilities = facilityService.getFacilitiesByRestaurantId(restaurantId);
        response.setMessage("Facilities retrieved successfully");
        response.setData(facilities);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}