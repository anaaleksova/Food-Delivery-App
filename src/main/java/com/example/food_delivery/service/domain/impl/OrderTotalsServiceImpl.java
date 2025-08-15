package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.DeliveryZone;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Restaurant;
import com.example.food_delivery.service.domain.OrderTotalsService;
import org.springframework.stereotype.Service;

@Service
public class OrderTotalsServiceImpl implements OrderTotalsService {

    // Simplified fee rules; you can move these to props/db later
    private static final double PLATFORM_FEE = 0.05; // 5%

    @Override
    public void setFeesAndRecalculate(Order order, Restaurant restaurant) {
        if (restaurant != null && !restaurant.getDeliveryZones().isEmpty()) {
            // naive: pick first zone's fee
            DeliveryZone z = restaurant.getDeliveryZones().get(0);
            order.setDeliveryFee(z.getDeliveryFee());
        } else {
            order.setDeliveryFee(0.0);
        }
        double sub = order.getSubtotal() != null ? order.getSubtotal() : 0.0;
        order.setPlatformFee(round2(sub * PLATFORM_FEE));
        order.recalcTotals();
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
