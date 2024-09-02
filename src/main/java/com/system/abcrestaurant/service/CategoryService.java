package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(String name, Long restaurantId) throws Exception;

    List<Category> findCategoryByRestaurantId(Long id) throws Exception;

    Category findCategoryById(Long id) throws Exception;

    Category updateCategory(Long id, String name, Long restaurantId) throws Exception;

    void deleteCategory(Long id) throws Exception;

    List<Category> findAllCategories();

}