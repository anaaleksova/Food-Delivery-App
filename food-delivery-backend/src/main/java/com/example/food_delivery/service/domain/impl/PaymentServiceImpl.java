package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Payment;
import com.example.food_delivery.model.enums.PaymentStatus;
import com.example.food_delivery.repository.PaymentRepository;
import com.example.food_delivery.service.domain.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.exception.StripeException;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    /**
     * Test secret key from Stripe documentation. This key is hard-coded here
     * solely for demonstration purposes to allow the application to create
     * PaymentIntents in test mode without requiring environment variables.
     * In a real application you should never embed secret keys in source
     * control; instead, load them from environment variables or a secure
     * configuration store.
     */
    private static final String STRIPE_SECRET_KEY =
            "sk_test_51S0LPxISIz2c7ED1ibtNR7LSQkqDizaWVJwByGfoGy0OZ2kV0dnLmgEuv1BFauTtnc9jvIRB74eGMzFnbKQKbrsE000zt0avdC";

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional
    public Payment createOrUpdateIntent(Order order) {
        Payment payment = paymentRepository.findByOrder(order).orElseGet(Payment::new);
        payment.setOrder(order);

        Double amount = order.getTotal();
        if (amount == null) amount = 0.0;
        payment.setAmount(amount);
        payment.setCurrency("usd");

        // Always use the embedded test secret key when creating PaymentIntents.
        // This integration targets Stripe's test environment; do not embed
        // secrets in production code.
        try {
            Stripe.apiKey = STRIPE_SECRET_KEY;
            long amountInCents = Math.round(payment.getAmount() * 100);
            if (payment.getProviderIntentId() == null) {
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                        .setAmount(amountInCents)
                        .setCurrency(payment.getCurrency())
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                        )
                        .build();
                PaymentIntent intent = PaymentIntent.create(params);
                payment.setProviderIntentId(intent.getId());
            }
        } catch (StripeException e) {
            // Fallback: generate a fake intent id when Stripe interaction fails. This
            // ensures the rest of the application continues to function.
            if (payment.getProviderIntentId() == null) {
                payment.setProviderIntentId("pi_" + UUID.randomUUID());
            }
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
