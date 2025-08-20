
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

@Service
public class PaymentApplicationServiceImpl implements PaymentApplicationService {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentApplicationServiceImpl(
            PaymentService paymentService,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository
    ) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public PaymentDto createIntent(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        Payment p = paymentService.createOrUpdateIntent(order);
        return BasicMappers.toDto(p);
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