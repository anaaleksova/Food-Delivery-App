//package com.example.food_delivery.service.application.impl;
//
//import com.example.food_delivery.dto.domain.DeliveryAssignmentDto;
//import com.example.food_delivery.model.domain.Courier;
//import com.example.food_delivery.model.domain.DeliveryAssignment;
//import com.example.food_delivery.model.domain.Order;
//import com.example.food_delivery.model.mapper.BasicMappers;
//import com.example.food_delivery.repository.CourierRepository;
//import com.example.food_delivery.repository.OrderRepository;
//import com.example.food_delivery.service.application.DeliveryApplicationService;
//import com.example.food_delivery.service.domain.CourierService;
//import com.example.food_delivery.service.domain.DeliveryService;
//import org.springframework.stereotype.Service;
//
//@Service
//public class DeliveryApplicationServiceImpl implements DeliveryApplicationService {
//
//    private final DeliveryService deliveryDomain;
//    private final OrderRepository orderRepository;
//    private final CourierService courierService;
//
//    public DeliveryApplicationServiceImpl(DeliveryService deliveryDomain, OrderRepository orderRepository, CourierService courierService) {
//        this.deliveryDomain = deliveryDomain;
//        this.orderRepository = orderRepository;
//        this.courierService = courierService;
//    }
//
//    @Override
//    public DeliveryAssignmentDto assignCourier(Long orderId,Long courierId) {
//        Order order = orderRepository.findById(orderId).orElseThrow();
//        Courier courier = courierService.findById(courierId).orElseThrow();
//        DeliveryAssignment da = deliveryDomain.assignCourier(order,courier);
//        return BasicMappers.toDto(da);
//    }
//}
