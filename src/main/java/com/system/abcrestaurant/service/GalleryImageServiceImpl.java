package com.system.abcrestaurant.service;

import com.system.abcrestaurant.dto.GalleryImageDTO;
import com.system.abcrestaurant.model.GalleryImage;
import com.system.abcrestaurant.repository.GalleryImageRepository;
import com.system.abcrestaurant.request.AddGalleryImageRequest;
import com.system.abcrestaurant.response.GalleryImageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GalleryImageServiceImpl implements GalleryImageService {

    @Autowired
    private GalleryImageRepository galleryImageRepository;

    @Override
    public GalleryImageResponse addImage(AddGalleryImageRequest request) {
        GalleryImage image = new GalleryImage();
        image.setUrl(request.getUrl());
        image.setRestaurantId(request.getRestaurantId());
        galleryImageRepository.save(image);
        return new GalleryImageResponse("Image added successfully.", image);
    }

    @Override
    public GalleryImageResponse updateImage(Long id, AddGalleryImageRequest request) {
        Optional<GalleryImage> optionalImage = galleryImageRepository.findById(id);
        if (optionalImage.isPresent()) {
            GalleryImage image = optionalImage.get();
            image.setUrl(request.getUrl());
            image.setRestaurantId(request.getRestaurantId());
            galleryImageRepository.save(image);
            return new GalleryImageResponse("Image updated successfully.", image);
        } else {
            throw new RuntimeException("Image not found.");
        }
    }



    @Override
    public GalleryImageResponse getImage(Long id) {
        Optional<GalleryImage> optionalImage = galleryImageRepository.findById(id);
        if (optionalImage.isPresent()) {
            return new GalleryImageResponse("Image retrieved successfully.", optionalImage.get());
        } else {
            throw new RuntimeException("Image not found.");
        }
    }

    @Override
    public List<GalleryImageDTO> getAllImages() {
        return galleryImageRepository.findAll().stream()
                .map(image -> new GalleryImageDTO(image.getId(), image.getUrl(), image.getRestaurantId()))
                .toList();
    }

    @Override
    public List<GalleryImageResponse> getImagesByRestaurantId(Long restaurantId) {
        return galleryImageRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::convertToGalleryImageResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<GalleryImage> findById(Long id) {
        return galleryImageRepository.findById(id);
    }



    @Override
    public void delete(GalleryImage galleryImage) {
        galleryImageRepository.delete(galleryImage);

    }

    // Move the convertToGalleryImageResponse method here
    private GalleryImageResponse convertToGalleryImageResponse(GalleryImage galleryImage) {
        return new GalleryImageResponse(galleryImage.getId(), galleryImage.getUrl(), galleryImage.getRestaurantId());
    }
}
