package com.example.food_delivery.repository;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByUserAndStatus(User user, OrderStatus status);
}
