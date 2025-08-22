package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.AddressDto;
import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.DisplayProductDto;
import com.example.food_delivery.dto.domain.OrderDto;
import com.example.food_delivery.model.domain.Order;

import java.util.List;
import java.util.Optional;

public interface OrderApplicationService {
    List<OrderDto> findAll();
    List<OrderDto> findAllConfirmed();
    Optional<DisplayOrderDto> findById(Long id);
    OrderDto getCart(String username);
    OrderDto addProductToCart(String username, Long ProductId);
    OrderDto removeProductFromCart(String username, Long ProductId);
    Optional<OrderDto> confirm(String username);
    Optional<OrderDto> cancel(String username);
    List<OrderDto> findOrdersForCourier(String username);
    OrderDto setDeliveryAddress(String username, AddressDto address);
    OrderDto applyDiscount(String username, Double discountAmount);

    DisplayOrderDto findOrCreatePending(String username);
}
