package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.domain.DeliveryAssignment;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.enums.DeliveryStatus;
import com.example.food_delivery.model.enums.OrderStatus;
import com.example.food_delivery.repository.CourierRepository;
import com.example.food_delivery.repository.DeliveryAssignmentRepository;
import com.example.food_delivery.service.domain.DeliveryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private final CourierRepository courierRepository;
    private final DeliveryAssignmentRepository deliveryAssignmentRepository;

    public DeliveryServiceImpl(CourierRepository courierRepository, DeliveryAssignmentRepository deliveryAssignmentRepository) {
        this.courierRepository = courierRepository;
        this.deliveryAssignmentRepository = deliveryAssignmentRepository;
    }

    @Override
    @Transactional
    public DeliveryAssignment assignCourier(Order order,Courier courier) {
        DeliveryAssignment da = new DeliveryAssignment();
        if(order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException();
        }
        da.setOrder(order);
        da.setCourier(courier);
        courier.setActive(false);
        da.setStatus(DeliveryStatus.ASSIGNED);
        return deliveryAssignmentRepository.save(da);
    }
}
