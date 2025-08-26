package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.PaymentDto;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;

public interface PaymentApplicationService {
    PaymentDto createIntent(Long orderId);
    PaymentDto simulateSuccess(Long paymentId);
    PaymentDto simulateFailure(Long paymentId);
    PaymentDto get(Long paymentId);
}
