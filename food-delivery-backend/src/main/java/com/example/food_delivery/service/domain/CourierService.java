package com.example.food_delivery.service.domain;

import com.example.food_delivery.model.domain.Courier;

import java.util.List;
import java.util.Optional;

public interface CourierService {
    List<Courier> findAll();

    Optional<Courier> findById(Long id);
    Courier save(Courier courier);

    Optional<Courier> update(Long id, Courier courier);

    Optional<Courier> deleteById(Long id);
}
