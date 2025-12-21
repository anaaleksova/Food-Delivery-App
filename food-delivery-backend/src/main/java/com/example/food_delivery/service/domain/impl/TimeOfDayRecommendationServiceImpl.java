package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Product;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.domain.UserOrderHistory;
import com.example.food_delivery.repository.UserOrderHistoryRepository;
import com.example.food_delivery.service.domain.TimeOfDayRecommendationService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimeOfDayRecommendationServiceImpl implements TimeOfDayRecommendationService {

    private final UserOrderHistoryRepository userOrderHistoryRepository;

    public TimeOfDayRecommendationServiceImpl(UserOrderHistoryRepository userOrderHistoryRepository) {
        this.userOrderHistoryRepository = userOrderHistoryRepository;
    }

    @Override
    public List<Product> getTimeBasedRecommendations(User user) {
        int currentHour = LocalTime.now().getHour();
        return getRecommendationsForHour(user, currentHour);
    }

    @Override
    public List<Product> getRecommendationsForHour(User user, int hourOfDay) {
        // Get all order history for this user
        List<UserOrderHistory> allHistory = userOrderHistoryRepository.findByUser(user);

        if (allHistory.isEmpty()) {
            return Collections.emptyList();
        }

        // Define time window (±2 hours from target hour)
        int startHour = (hourOfDay - 2 + 24) % 24;
        int endHour = (hourOfDay + 2) % 24;

        // Filter orders within the time window
        List<UserOrderHistory> relevantOrders = allHistory.stream()
                .filter(order -> isInTimeWindow(order.getHourOfDay(), startHour, endHour))
                .toList();

        if (relevantOrders.isEmpty()) {
            // Fallback to most frequently ordered products overall
            return getMostFrequentProducts(allHistory);
        }

        // Calculate product scores based on frequency and recency
        Map<Product, Double> productScores = new HashMap<>();

        for (UserOrderHistory order : relevantOrders) {
            Product product = order.getProduct();

            // Skip if product is not available
            if (product == null || !Boolean.TRUE.equals(product.getIsAvailable())) {
                continue;
            }

            // Calculate base score (frequency)
            double score = productScores.getOrDefault(product, 0.0);
            score += order.getQuantity();

            // Boost score if hour matches exactly
            if (order.getHourOfDay() != null && order.getHourOfDay().equals(hourOfDay)) {
                score *= 1.5;
            }

            // Boost score for recent orders
            long daysSinceOrder = java.time.temporal.ChronoUnit.DAYS.between(
                    order.getOrderDate().toLocalDate(),
                    java.time.LocalDate.now()
            );

            if (daysSinceOrder <= 7) {
                score *= 1.3; // Recent orders weighted more
            } else if (daysSinceOrder <= 30) {
                score *= 1.1;
            }

            productScores.put(product, score);
        }

        // Sort by score and return top recommendations
        return productScores.entrySet().stream()
                .sorted(Map.Entry.<Product, Double>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * Check if an hour is within a time window (handles midnight wrap-around)
     */
    private boolean isInTimeWindow(Integer hour, int startHour, int endHour) {
        if (hour == null) {
            return false;
        }

        if (startHour <= endHour) {
            // Normal case: e.g., 8-12
            return hour >= startHour && hour <= endHour;
        } else {
            // Wrap around midnight: e.g., 22-2
            return hour >= startHour || hour <= endHour;
        }
    }

    /**
     * Fallback: Get most frequently ordered products overall
     */
    private List<Product> getMostFrequentProducts(List<UserOrderHistory> history) {
        Map<Product, Integer> productCounts = new HashMap<>();

        for (UserOrderHistory order : history) {
            Product product = order.getProduct();
            if (product != null && Boolean.TRUE.equals(product.getIsAvailable())) {
                productCounts.put(product,
                        productCounts.getOrDefault(product, 0) + order.getQuantity());
            }
        }

        return productCounts.entrySet().stream()
                .sorted(Map.Entry.<Product, Integer>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}