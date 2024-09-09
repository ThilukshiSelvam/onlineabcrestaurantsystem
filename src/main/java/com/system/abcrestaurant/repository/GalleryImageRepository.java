package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {

        List<GalleryImage> findByRestaurantId(Long restaurantId);


}