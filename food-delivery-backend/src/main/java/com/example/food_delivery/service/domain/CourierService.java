package com.example.food_delivery.service.domain;

import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.domain.Order;

import java.util.List;
import java.util.Optional;

public interface CourierService {
    List<Courier> findAll();

    Optional<Courier> findById(Long id);
    Courier save(Courier courier);

    Optional<Courier> update(Long id, Courier courier);

    Optional<Courier> deleteById(Long id);
    Optional<Courier> findByUsername(String username);
    Order assignToOrder(String courierUsername, Long orderId);
    Order completeDelivery(String courierUsername, Long orderId);
    List<Courier> findAvailable();
    List<Order> findDeliveredOrders(String courierUsername);
}
