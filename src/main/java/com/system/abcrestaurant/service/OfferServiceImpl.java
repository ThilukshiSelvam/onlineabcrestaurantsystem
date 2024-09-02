package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Offer;
import com.system.abcrestaurant.model.Restaurant;
import com.system.abcrestaurant.repository.OfferRepository;
import com.system.abcrestaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import java.util.List;

@Service
public class OfferServiceImpl implements OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OfferValidator offerValidator;

    @Override
    public Offer createOffer(@Valid Offer offer, Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        offerValidator.validateOffer(offer, restaurantId); // Validate before saving

        offer.setRestaurant(restaurant);
        return offerRepository.save(offer);
    }

    @Override
    public Offer updateOffer(Long id, @Valid Offer offerDetails) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setTitle(offerDetails.getTitle());
        offer.setDescription(offerDetails.getDescription());
        offer.setDiscountPercentage(offerDetails.getDiscountPercentage());
        offer.setStartDate(offerDetails.getStartDate());
        offer.setEndDate(offerDetails.getEndDate());

        offerValidator.validateOffer(offer, offer.getRestaurant().getId()); // Validate before saving

        return offerRepository.save(offer);
    }

    @Override
    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    @Override
    public List<Offer> getAllOffersByRestaurant(Long restaurantId) {
        return offerRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }
}
