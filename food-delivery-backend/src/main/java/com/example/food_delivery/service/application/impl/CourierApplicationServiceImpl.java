package com.example.food_delivery.service.application.impl;

import com.example.food_delivery.dto.domain.CourierDto;
import com.example.food_delivery.dto.domain.DisplayCourierDto;
import com.example.food_delivery.dto.domain.DisplayProductDto;
import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.mapper.BasicMappers;
import com.example.food_delivery.service.application.CourierApplicationService;
import com.example.food_delivery.service.domain.CourierService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourierApplicationServiceImpl implements CourierApplicationService {

    private final CourierService courierService;

    public CourierApplicationServiceImpl(CourierService courierService) {
        this.courierService = courierService;
    }

    @Override
    public List<DisplayCourierDto> findAll() {
        return courierService.findAll().stream().map(DisplayCourierDto::from).toList();
    }

    @Override
    public Optional<DisplayCourierDto> findById(Long id) {
        return courierService.findById(id).map(DisplayCourierDto::from);
    }

    @Override
    public CourierDto save(CourierDto createCourier) {
        return BasicMappers.toDto(courierService.save(BasicMappers.fromDto(createCourier)));
    }

    @Override
    public Optional<CourierDto> update(Long id, Courier createCourier) {
        Courier courier = courierService.findById(id).orElseThrow();
        return courierService
                .update(id, createCourier)
                .map(BasicMappers::toDto);
    }

    @Override
    public Optional<CourierDto> deleteById(Long id) {
        return courierService
                .deleteById(id)
                .map(BasicMappers::toDto);
    }
}
