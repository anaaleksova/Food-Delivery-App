package com.example.food_delivery.repository;

import com.example.food_delivery.model.domain.Courier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourierRepository extends JpaRepository<Courier, Long> { }
