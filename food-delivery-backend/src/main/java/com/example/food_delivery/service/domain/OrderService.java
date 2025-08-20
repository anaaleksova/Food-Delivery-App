package com.example.food_delivery.service.domain;

import com.example.food_delivery.model.domain.Order;

import java.util.Optional;

public interface OrderService {
    Optional<Order> findPending(String username);

    Order findOrCreatePending(String username);

    Optional<Order> confirm(String username);

    Optional<Order> cancel(String username);
}
