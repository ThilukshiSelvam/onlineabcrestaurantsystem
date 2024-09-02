package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Category;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(String name, Long restaurant_id) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurant_id);

        if (restaurant == null) {
            throw new Exception("Restaurant not found");
        }

        // Check if a category with the same name already exists for the restaurant
        if (categoryRepository.existsByNameAndRestaurantId(name, restaurant_id)) {
            throw new Exception("Category with the same name already exists for this restaurant");
        }

        Category category = new Category();
        category.setName(name);
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {
        return categoryRepository.findByRestaurantId(id);
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new Exception("Category not found");
        }
        return optionalCategory.get();
    }

    @Override
    public Category updateCategory(Long id, String name, Long restaurant_id) throws Exception {
        Category category = findCategoryById(id);
        Restaurant restaurant = restaurantService.findRestaurantById(restaurant_id);

        if (restaurant == null) {
            throw new Exception("Restaurant not found");
        }

        // Check if a category with the same name already exists for the restaurant
        if (categoryRepository.existsByNameAndRestaurantId(name, restaurant_id)) {
            throw new Exception("Category with the same name already exists for this restaurant");
        }

        category.setName(name);
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        Category category = findCategoryById(id);
        categoryRepository.delete(category);
    }

    @Override
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }


}