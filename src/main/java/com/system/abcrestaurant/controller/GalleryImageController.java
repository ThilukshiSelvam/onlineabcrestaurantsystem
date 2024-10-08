package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.GalleryImage;
import com.system.abcrestaurant.request.AddGalleryImageRequest;
import com.system.abcrestaurant.response.GalleryImageResponse;
import com.system.abcrestaurant.service.GalleryImageService;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/gallery")
@Validated
public class GalleryImageController {

    @Autowired
    private GalleryImageService galleryImageService;

    @PostMapping
    public ResponseEntity<Map<String, String>> addImage(@Valid @RequestBody AddGalleryImageRequest request) {
        galleryImageService.addImage(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image added successfully.");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateImage(@PathVariable Long id, @Valid @RequestBody AddGalleryImageRequest request) {
        galleryImageService.updateImage(id, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image updated successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        // Fetch the image from the database
        Optional<GalleryImage> galleryImageOptional = galleryImageService.findById(id);

        // Check if the image exists
        if (galleryImageOptional.isEmpty()) {
            response.put("message", "Image not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        // If the image exists, proceed with deletion
        galleryImageService.delete(galleryImageOptional.get());
        response.put("message", "Image deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<GalleryImageResponse> getImage(@PathVariable Long id) {
        GalleryImageResponse response = galleryImageService.getImage(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllImages() {
        Map<String, Object> response = new HashMap<>();
        response.put("images", galleryImageService.getAllImages());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Map<String, Object>> getImagesByRestaurantId(@PathVariable Long restaurantId) {
        Map<String, Object> response = new HashMap<>();
        response.put("images", galleryImageService.getImagesByRestaurantId(restaurantId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        v -> v.getPropertyPath().toString(),
                        v -> v.getMessage()
                ));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}