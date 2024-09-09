package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Category;
import com.system.abcrestaurant.model.Food;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.repository.FoodRepository;
import com.system.abcrestaurant.request.CreateFoodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FoodServiceImp implements FoodService {

    @Autowired
    private FoodRepository foodRepository;


    @Override
    public Food createFood(CreateFoodRequest request, Restaurant restaurant, Category category) throws Exception {
        Food food = new Food();
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImages(request.getImages());
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);
        food.setVegetarian(request.isVegetarian());
        food.setSeasonal(request.isSeasonal());
        food.setAvailable(true);
        food.setCreatedDate(new Date());

        System.out.println("Creating food with isVegetarian: " + food.isVegetarian());
        System.out.println("Creating food with isSeasonal: " + food.isSeasonal());

        return foodRepository.save(food);
    }

    @Override
    public void deleteFood(Long id) throws Exception {
        Optional<Food> food = foodRepository.findById(id);
        if (food.isEmpty()) {
            throw new Exception("Food not found");
        }
        foodRepository.deleteById(id);
    }

    @Override
    public Food updateAvailabilityStatus(Long id) throws Exception {
        Optional<Food> foodOptional = foodRepository.findById(id);
        if (foodOptional.isEmpty()) {
            throw new Exception("Food not found");
        }
        Food food = foodOptional.get();
        food.setAvailable(!food.isAvailable());

        return foodRepository.save(food);
    }

    @Override
    public List<Food> searchFood(String keyword) throws Exception {
        return foodRepository.searchFood(keyword);
    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, boolean vegetarian, boolean seasonal, boolean nonveg, String foodCategory) throws Exception {
        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

        // Filter the food list based on the provided parameters
        if (vegetarian) {
            foods.removeIf(food -> !food.isVegetarian());
        }
        if (seasonal) {
            foods.removeIf(food -> !food.isSeasonal());
        }
        if (nonveg) {
            foods.removeIf(food -> food.isVegetarian());
        }
        if (foodCategory != null) {
            foods.removeIf(food -> !food.getFoodCategory().getName().equalsIgnoreCase(foodCategory));
        }

        return foods;
    }

    @Override
    public List<Food> getAllFoodByRestaurantId(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }
}
