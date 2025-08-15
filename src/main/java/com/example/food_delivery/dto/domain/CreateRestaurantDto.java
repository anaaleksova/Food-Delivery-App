package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Restaurant;

public record CreateRestaurantDto(
        String name,
        String description
) {

    public Restaurant toRestaurant() {
        return new Restaurant(name, description);
    }

}
