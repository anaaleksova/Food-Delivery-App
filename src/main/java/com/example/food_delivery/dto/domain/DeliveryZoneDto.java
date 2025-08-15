package com.example.food_delivery.dto.domain;

import lombok.Data;

@Data
public class DeliveryZoneDto {
    private Long id;
    private String name;
    private Double radiusKm;
    private CoordinatesDto center;
    private Double deliveryFee;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getRadiusKm() {
        return radiusKm;
    }

    public void setRadiusKm(Double radiusKm) {
        this.radiusKm = radiusKm;
    }

    public CoordinatesDto getCenter() {
        return center;
    }

    public void setCenter(CoordinatesDto center) {
        this.center = center;
    }

    public Double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }
}