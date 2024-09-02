package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.dto.CategoryDto;
import com.system.abcrestaurant.model.Category;
import com.system.abcrestaurant.response.MessageResponse;
import com.system.abcrestaurant.service.CategoryService;
import com.system.abcrestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @PostMapping("/admin/category")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDto categoryDto,
                                            @RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            Category createdCategory = categoryService.createCategory(categoryDto.getName(), categoryDto.getRestaurant_id());
            return new ResponseEntity<>(new MessageResponse("Category added successfully"), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/category/restaurant/{id}")
    public ResponseEntity<?> getRestaurantCategory(@RequestHeader("Authorization") String jwt,
                                                   @PathVariable("id") Long restaurantId) {
        try {
            userService.findUserByJwtToken(jwt);
            List<Category> categories = categoryService.findCategoryByRestaurantId(restaurantId);
            if (categories.isEmpty()) {
                return new ResponseEntity<>(new MessageResponse("No categories found for the specified restaurant"), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/admin/category/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Long id,
                                            @Valid @RequestBody CategoryDto categoryDto,
                                            @RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            Category updatedCategory = categoryService.updateCategory(id, categoryDto.getName(), categoryDto.getRestaurant_id());
            return new ResponseEntity<>(new MessageResponse("Category updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/admin/category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id,
                                            @RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            categoryService.deleteCategory(id);
            return new ResponseEntity<>(new MessageResponse("Category deleted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/admin/getAllCategory")
    public ResponseEntity<?> getAllCategory(@RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            List<CategoryDto> categories = categoryService.findAllCategories().stream()
                    .map(category -> {
                        CategoryDto dto = new CategoryDto();
                        dto.setId(category.getId());
                        dto.setName(category.getName());
                        dto.setRestaurant_id(category.getRestaurant().getId());
                        return dto;
                    })
                    .collect(Collectors.toList());

            if (categories.isEmpty()) {
                return new ResponseEntity<>(new MessageResponse("No categories found"), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        return new ResponseEntity<>(new MessageResponse(String.join(", ", errors)), HttpStatus.BAD_REQUEST);
    }
}