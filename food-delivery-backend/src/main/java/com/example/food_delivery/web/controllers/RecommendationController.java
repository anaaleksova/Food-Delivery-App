package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.DisplayProductDto;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.service.application.RecommendationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationApplicationService recommendationApplicationService;

    /**
     * Smart recommendations with 5-step fallback strategy:
     * 1. My orders - exact hour
     * 2. My orders - ±2 hours window
     * 3. My most popular products (whole day)
     * 4. What OTHER users order at this time (collaborative)
     * 5. Global most popular products
     *
     * All logic is handled in the service layer!
     */
    @GetMapping("/time-based")
    public ResponseEntity<List<DisplayProductDto>> getSmartTimeBasedRecommendations(
            @AuthenticationPrincipal User user) {

        List<DisplayProductDto> recommendations =
                recommendationApplicationService.getTimeBasedRecommendations(user.getUsername());

        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get recommendations for specific hour
     */
    @GetMapping("/time-based/{hour}")
    public ResponseEntity<List<DisplayProductDto>> getRecommendationsForHour(
            @PathVariable int hour,
            @AuthenticationPrincipal User user) {

        if (hour < 0 || hour > 23) {
            return ResponseEntity.badRequest().build();
        }

        List<DisplayProductDto> recommendations =
                recommendationApplicationService.getRecommendationsForHour(user.getUsername(), hour);

        return ResponseEntity.ok(recommendations);
    }
}