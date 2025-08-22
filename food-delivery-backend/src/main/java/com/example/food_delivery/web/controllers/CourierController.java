package com.example.food_delivery.web.controllers;

import com.example.food_delivery.dto.domain.CourierDto;
import com.example.food_delivery.dto.domain.CreateProductDto;
import com.example.food_delivery.dto.domain.DisplayCourierDto;
import com.example.food_delivery.dto.domain.DisplayProductDto;
import com.example.food_delivery.model.mapper.BasicMappers;
import com.example.food_delivery.service.application.CourierApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/couriers")
public class CourierController {
    private final CourierApplicationService courierApplicationService;

    public CourierController(CourierApplicationService courierApplicationService) {
        this.courierApplicationService = courierApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayCourierDto>> findAll() {
        return ResponseEntity.ok(courierApplicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCourierDto> findById(@PathVariable Long id) {
        return courierApplicationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<CourierDto> save(@RequestBody CourierDto createCourier) {
        return ResponseEntity.ok(courierApplicationService.save(createCourier));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<CourierDto> update(@PathVariable Long id, @RequestBody CourierDto createCourier) {
        return courierApplicationService
                .update(id, BasicMappers.fromDto(createCourier))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CourierDto> deleteById(@PathVariable Long id) {
        return courierApplicationService
                .deleteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
