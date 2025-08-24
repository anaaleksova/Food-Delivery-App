package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Product;
import com.example.food_delivery.model.domain.Restaurant;

public record CreateProductDto(
        String name,
        String description,
        Double price,
        Integer quantity,
        Long restaurantId,
        String category,
        String imageUrl
) {

    public Product toProduct(Restaurant restaurant) {
        return new Product(
                name,
                description,
                price,
                quantity,
                restaurant,
                category,
                imageUrl
        );
    }

}
