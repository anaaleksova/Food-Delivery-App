package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.AddressDto;
import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.OrderDto;

import java.util.Optional;

//SMENETO
public interface OrderApplicationService {
    OrderDto getCart(String username);
    OrderDto addProductToCart(String username, Long ProductId);
    OrderDto removeProductFromCart(String username, Long ProductId);
    Optional<OrderDto> confirm(String username);
    Optional<OrderDto> cancel(String username);

    // Optional helpers used by checkout screens
    OrderDto setDeliveryAddress(String username, AddressDto address);
    OrderDto applyDiscount(String username, Double discountAmount);

    DisplayOrderDto findOrCreatePending(String username);
}
