package com.example.food_delivery.dto.domain;


import com.example.food_delivery.model.domain.Product;

import java.util.List;

public record DisplayProductDto(
        Long id,
        String name,
        String description,
        Double price,
        Integer quantity,
        Long restaurantId
) {

    public static DisplayProductDto from(Product Product) {
        return new DisplayProductDto(
                Product.getId(),
                Product.getName(),
                Product.getDescription(),
                Product.getPrice(),
                Product.getQuantity(),
                Product.getRestaurant().getId()
        );
    }

    public static List<DisplayProductDto> from(List<Product> Products) {
        return Products
                .stream()
                .map(DisplayProductDto::from)
                .toList();
    }

}
