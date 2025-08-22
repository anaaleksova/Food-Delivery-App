package com.example.food_delivery.service.domain;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Product;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> findAll();

    Optional<Order> findById(Long id);
    Optional<Order> findPending(String username);

    Order findOrCreatePending(String username);

    Optional<Order> confirm(String username);

    Optional<Order> cancel(String username);

    List<Order> findConfirmed();

    List<Order> findOrdersForCourier(String username);
}
