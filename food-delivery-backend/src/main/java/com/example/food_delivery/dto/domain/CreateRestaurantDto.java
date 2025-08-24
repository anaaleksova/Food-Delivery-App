package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Restaurant;

public record CreateRestaurantDto(
        String name,
        String description,
        String openHours,
        String imageUrl,
        String category
) {

    public Restaurant toRestaurant() {
        return new Restaurant(name, description,openHours,imageUrl,category);
    }

}
