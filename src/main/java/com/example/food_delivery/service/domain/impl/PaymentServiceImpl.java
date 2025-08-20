
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
        // set from order totals if present, otherwise use 0.0 to avoid NPEs
        Double amount = order.getTotal();
        if (amount == null) {
            amount = 0.0;
        }
        payment.setAmount(amount);
        payment.setCurrency("usd");
        if (payment.getProviderIntentId() == null) {
            // Simulate a provider intent id (e.g. Stripe PaymentIntent id)
            payment.setProviderIntentId("pi_" + UUID.randomUUID());
        }
        payment.setStatus(PaymentStatus.REQUIRES_ACTION);
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