package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.PaymentDto;

public interface PaymentApplicationService {
    PaymentDto createIntent(Long orderId);
    PaymentDto simulateSuccess(Long paymentId);
    PaymentDto simulateFailure(Long paymentId);
    PaymentDto get(Long paymentId);
}
