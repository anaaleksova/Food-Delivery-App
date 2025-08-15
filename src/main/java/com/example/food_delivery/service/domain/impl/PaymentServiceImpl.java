package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Payment;
import com.example.food_delivery.model.enums.PaymentStatus;
import com.example.food_delivery.repository.PaymentRepository;
import com.example.food_delivery.service.domain.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional
    public Payment createOrUpdateIntent(Order order) {
        Payment payment = paymentRepository.findByOrder(order).orElseGet(Payment::new);
        payment.setOrder(order);
        payment.setAmount(order.getTotal());
        payment.setStatus(PaymentStatus.REQUIRES_ACTION);
        if (payment.getProviderIntentId() == null) {
            payment.setProviderIntentId("test_" + UUID.randomUUID());
        }
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public Payment markSucceeded(Payment payment) {
        payment.setStatus(PaymentStatus.CAPTURED);
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public Payment markFailed(Payment payment, String reason) {
        payment.setStatus(PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }
}
