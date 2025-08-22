//package com.example.food_delivery.web.controllers;
//
//import com.example.food_delivery.dto.domain.DeliveryAssignmentDto;
//import com.example.food_delivery.service.application.DeliveryApplicationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/delivery")
//public class DeliveryController {
//
//    private final DeliveryApplicationService deliveryApplicationService;
//
//    public DeliveryController(DeliveryApplicationService deliveryApplicationService) {
//        this.deliveryApplicationService = deliveryApplicationService;
//    }
//
//    @PostMapping("/{orderId}/assign/{courierId}")
//    public ResponseEntity<DeliveryAssignmentDto> assign(@PathVariable Long orderId,@PathVariable Long courierId) {
//        return ResponseEntity.ok(deliveryApplicationService.assignCourier(orderId,courierId));
//    }
//}
