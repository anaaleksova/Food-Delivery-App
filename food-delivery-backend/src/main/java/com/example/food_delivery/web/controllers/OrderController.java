package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.DisplayProductDto;
import com.example.food_delivery.dto.domain.OrderDto;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.service.application.OrderApplicationService;
import org.aspectj.weaver.ast.Or;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderApplicationService orderApplicationService;

    public OrderController(OrderApplicationService orderApplicationService) {
        this.orderApplicationService = orderApplicationService;
    }
    @GetMapping("/confirmed")
    public ResponseEntity<List<OrderDto>> findConfirmed() {
        return ResponseEntity.ok(orderApplicationService.findAllConfirmed());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> findById(@PathVariable Long id) {
        return orderApplicationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    @GetMapping("/track/{id}")
    public ResponseEntity<OrderDto> trackOrder(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return orderApplicationService
                .findById(id)
                .filter(order -> order.getUserUsername().equals(user.getUsername()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> findConfirmedOrdersForCustomer(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderApplicationService.findConfirmedOrdersForCustomer(user.getUsername()));
    }
}
