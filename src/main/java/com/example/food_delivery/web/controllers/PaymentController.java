package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.PaymentDto;
import com.example.food_delivery.service.application.PaymentApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentApplicationService paymentApplicationService;

    public PaymentController(PaymentApplicationService paymentApplicationService) {
        this.paymentApplicationService = paymentApplicationService;
    }

    @PostMapping("/{orderId}/intent")
    public ResponseEntity<PaymentDto> createIntent(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentApplicationService.createIntent(orderId));
    }

    // test-only; replace with PSP webhooks in prod
    @PostMapping("/{paymentId}/simulate-success")
    public ResponseEntity<PaymentDto> simulateSuccess(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.simulateSuccess(paymentId));
    }

    @PostMapping("/{paymentId}/simulate-failure")
    public ResponseEntity<PaymentDto> simulateFailure(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.simulateFailure(paymentId));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDto> get(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentApplicationService.get(paymentId));
    }
}
