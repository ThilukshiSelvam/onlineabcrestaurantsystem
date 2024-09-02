package com.system.abcrestaurant.response;

import com.system.abcrestaurant.model.GalleryImage;
import lombok.Data;

@Data
public class GalleryImageResponse {

    private String message;
    private GalleryImage image;

    public GalleryImageResponse(String message, GalleryImage image) {
        this.message = message;
        this.image = image;
    }

    // Getters and setters
}