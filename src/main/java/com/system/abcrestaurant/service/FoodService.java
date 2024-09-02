package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Category;
import com.system.abcrestaurant.model.Food;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.request.CreateFoodRequest;

import java.util.List;

public interface FoodService {

    Food createFood(CreateFoodRequest request, Restaurant restaurant, Category category) throws Exception;


    void deleteFood(Long id) throws Exception;

    Food updateAvailabilityStatus(Long id) throws Exception;

    List<Food> searchFood(String keyword) throws Exception;

    List<Food> getRestaurantsFood(Long restaurantId, boolean vegetarian, boolean seasonal, boolean nonveg, String foodCategory) throws Exception;
}
