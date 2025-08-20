
package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.PaymentDto;
import com.example.food_delivery.service.application.PaymentApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "payment-controller")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentApplicationService paymentApplicationService;

    public PaymentController(PaymentApplicationService paymentApplicationService) {
        this.paymentApplicationService = paymentApplicationService;
    }

    @Operation(summary = "Create or update a PaymentIntent for an order (simulated)")
    @PostMapping("/{orderId}/intent")
    public ResponseEntity<PaymentDto> intent(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentApplicationService.createIntent(orderId));
    }

    @Operation(summary = "Simulate a successful capture for a payment")
    @PostMapping("/{paymentId}/simulate-success")
    public ResponseEntity<PaymentDto> simulateSuccess(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.simulateSuccess(paymentId));
    }

    @Operation(summary = "Simulate a failed payment")
    @PostMapping("/{paymentId}/simulate-failure")
    public ResponseEntity<PaymentDto> simulateFailure(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.simulateFailure(paymentId));
    }

    @Operation(summary = "Get payment by id")
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDto> get(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.get(paymentId));
    }
}