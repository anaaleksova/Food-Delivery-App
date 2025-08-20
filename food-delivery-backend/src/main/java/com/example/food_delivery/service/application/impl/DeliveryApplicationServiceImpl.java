package com.example.food_delivery.service.application.impl;

import com.example.food_delivery.dto.domain.DeliveryAssignmentDto;
import com.example.food_delivery.model.domain.DeliveryAssignment;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.mapper.BasicMappers;
import com.example.food_delivery.repository.OrderRepository;
import com.example.food_delivery.service.application.DeliveryApplicationService;
import com.example.food_delivery.service.domain.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class DeliveryApplicationServiceImpl implements DeliveryApplicationService {

    private final DeliveryService deliveryDomain;
    private final OrderRepository orderRepository;

    public DeliveryApplicationServiceImpl(DeliveryService deliveryDomain, OrderRepository orderRepository) {
        this.deliveryDomain = deliveryDomain;
        this.orderRepository = orderRepository;
    }

    @Override
    public DeliveryAssignmentDto assignCourier(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        DeliveryAssignment da = deliveryDomain.assignCourier(order);
        return BasicMappers.toDto(da);
    }
}
