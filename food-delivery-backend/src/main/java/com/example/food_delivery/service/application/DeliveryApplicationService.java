package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.DeliveryAssignmentDto;

public interface DeliveryApplicationService {
    DeliveryAssignmentDto assignCourier(Long orderId,Long courierId);
}
