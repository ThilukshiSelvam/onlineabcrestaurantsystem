package com.system.abcrestaurant.service;

import com.system.abcrestaurant.dto.GalleryImageDTO;
import com.system.abcrestaurant.model.GalleryImage;
import com.system.abcrestaurant.request.AddGalleryImageRequest;
import com.system.abcrestaurant.response.GalleryImageResponse;

import java.util.List;

public interface GalleryImageService {

    GalleryImageResponse addImage(AddGalleryImageRequest request);

    GalleryImageResponse updateImage(Long id, AddGalleryImageRequest request);

    GalleryImageResponse deleteImage(Long id);

    GalleryImageResponse getImage(Long id);

    List<GalleryImageDTO> getAllImages();

    public List<GalleryImageResponse> getImagesByRestaurantId(Long restaurantId);

}