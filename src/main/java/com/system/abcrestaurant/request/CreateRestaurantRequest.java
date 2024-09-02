package com.system.abcrestaurant.request;

import com.system.abcrestaurant.model.Address;
import com.system.abcrestaurant.model.ContactInformation;
import lombok.Data;

import java.util.List;

@Data
public class CreateRestaurantRequest {

    private String name;
    private String description;
    private String cuisineType;
    private Address address;
    private ContactInformation contactInformation;
    private String openingHours;
    private List<String> images;
}
