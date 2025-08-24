package com.example.food_delivery.service.application;


import com.example.food_delivery.dto.domain.CourierDto;
import com.example.food_delivery.dto.domain.DisplayCourierDto;
import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.OrderDto;
import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.domain.Order;

import java.util.List;
import java.util.Optional;

public interface CourierApplicationService {
    List<DisplayCourierDto> findAll();

    Optional<DisplayCourierDto> findById(Long id);
    CourierDto save(CourierDto createCourier);

    Optional<CourierDto> update(Long id, Courier createCourier);

    Optional<CourierDto> deleteById(Long id);
    DisplayOrderDto assignToOrder(String courierUsername, Long orderId);
    DisplayOrderDto completeDelivery(String courierUsername, Long orderId);
    List<DisplayCourierDto> findAvailable();
    List<OrderDto> findDeliveredOrders(String courierUsername);
}
