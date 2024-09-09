package com.system.abcrestaurant.response;

import com.system.abcrestaurant.model.GalleryImage;
import lombok.Data;

@Data
public class GalleryImageResponse {

    private Long id;
    private String url;
    private Long restaurantId;
    private String message;

    // Constructor accepting three arguments
    public GalleryImageResponse(Long id, String url, Long restaurantId) {
        this.id = id;
        this.url = url;
        this.restaurantId = restaurantId;
    }

    // Constructor accepting a message and a GalleryImage
    public GalleryImageResponse(String message, GalleryImage galleryImage) {
        this.message = message;
        this.id = galleryImage.getId();
        this.url = galleryImage.getUrl();
        this.restaurantId = galleryImage.getRestaurantId();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}


    // Getters and setters