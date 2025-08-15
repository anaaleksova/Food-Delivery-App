package com.example.food_delivery.service.domain;

import com.example.food_delivery.model.domain.DeliveryAssignment;
import com.example.food_delivery.model.domain.Order;

public interface DeliveryService {
    DeliveryAssignment assignCourier(Order order);
}
