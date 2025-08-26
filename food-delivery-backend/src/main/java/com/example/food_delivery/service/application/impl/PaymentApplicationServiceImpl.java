package com.example.food_delivery.service.application.impl;

import com.example.food_delivery.dto.domain.PaymentDto;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Payment;
import com.example.food_delivery.model.mapper.BasicMappers;
import com.example.food_delivery.repository.OrderRepository;
import com.example.food_delivery.repository.PaymentRepository;
import com.example.food_delivery.service.application.PaymentApplicationService;
import com.example.food_delivery.service.domain.PaymentService;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;

@Service
public class PaymentApplicationServiceImpl implements PaymentApplicationService {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentApplicationServiceImpl(PaymentService paymentService,
                                         PaymentRepository paymentRepository,
                                         OrderRepository orderRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public PaymentDto createIntent(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        Payment p = paymentService.createOrUpdateIntent(order);
        PaymentDto dto = BasicMappers.toDto(p);

        try {
            // Use the same hard-coded secret key as in PaymentServiceImpl for retrieving the client secret.
            String secret = "sk_test_51S0LPxISIz2c7ED1ibtNR7LSQkqDizaWVJwByGfoGy0OZ2kV0dnLmgEuv1BFauTtnc9jvIRB74eGMzFnbKQKbrsE000zt0avdC";
            if (p.getProviderIntentId() != null && p.getProviderIntentId().startsWith("pi_")) {
                Stripe.apiKey = secret;
                PaymentIntent intent = PaymentIntent.retrieve(p.getProviderIntentId());
                dto.setClientSecret(intent.getClientSecret());
            }
        } catch (Exception ignored) {}

        return dto;
    }

    @Override
    public PaymentDto simulateSuccess(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow();
        return BasicMappers.toDto(paymentService.markSucceeded(p));
    }

    @Override
    public PaymentDto simulateFailure(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow();
        return BasicMappers.toDto(paymentService.markFailed(p, "simulated"));
    }

    @Override
    public PaymentDto get(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow();
        return BasicMappers.toDto(p);
    }
}
