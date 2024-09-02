package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.Offer;

import java.util.List;

public interface OfferService {
    Offer createOffer(Offer offer, Long restaurantId);
    Offer updateOffer(Long id, Offer offer);
    void deleteOffer(Long id);
    List<Offer> getAllOffersByRestaurant(Long restaurantId);
    public List<Offer> getAllOffers();
}
