package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.OrderDto;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.service.application.OrderApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderApplicationService orderApplicationService;

    public OrderController(OrderApplicationService orderApplicationService) {
        this.orderApplicationService = orderApplicationService;
    }

    @GetMapping("/pending")
    public ResponseEntity<DisplayOrderDto> findOrCreatePending(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderApplicationService.findOrCreatePending(user.getUsername()));
    }

    @PutMapping("/pending/confirm")
    public ResponseEntity<OrderDto> confirm(@AuthenticationPrincipal User user) {
        return orderApplicationService
                .confirm(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/pending/cancel")
    public ResponseEntity<OrderDto> cancel(@AuthenticationPrincipal User user) {
        return orderApplicationService
                .cancel(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

}
