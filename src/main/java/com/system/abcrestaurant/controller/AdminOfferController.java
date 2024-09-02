package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.Offer;
import com.system.abcrestaurant.response.MessageResponse;
import com.system.abcrestaurant.response.OfferListResponse;
import com.system.abcrestaurant.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/offers")
public class AdminOfferController {

    @Autowired
    private OfferService offerService;

    @PostMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createOffer(@PathVariable Long restaurantId, @Valid @RequestBody Offer offer, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        offerService.createOffer(offer, restaurantId);
        return ResponseEntity.ok(new MessageResponse("Offer created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateOffer(@PathVariable Long id, @Valid @RequestBody Offer offer, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        offerService.updateOffer(id, offer);
        return ResponseEntity.ok(new MessageResponse("Offer updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        MessageResponse res = new MessageResponse("Offer deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OfferListResponse> getAllOffersByRestaurant(@PathVariable Long restaurantId) {
        List<Offer> offers = offerService.getAllOffersByRestaurant(restaurantId);
        OfferListResponse response = new OfferListResponse("Offers retrieved successfully", offers);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/getAlloffers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OfferListResponse> getAllOffers() {
        List<Offer> offers = offerService.getAllOffers();  // Ensure this method exists in your service
        OfferListResponse response = new OfferListResponse("Offers retrieved successfully", offers);
        return ResponseEntity.ok(response);
    }

}
