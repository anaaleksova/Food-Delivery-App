package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.domain.Product;
import com.example.food_delivery.repository.CourierRepository;
import com.example.food_delivery.service.domain.CourierService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourierServiceImpl implements CourierService {

    private final CourierRepository courierRepository;

    public CourierServiceImpl(CourierRepository courierRepository) {
        this.courierRepository = courierRepository;
    }

    @Override
    public List<Courier> findAll() {
        return courierRepository.findAll();
    }

    @Override
    public Optional<Courier> findById(Long id) {
        return courierRepository.findById(id);
    }

    @Override
    public Courier save(Courier courier) {
        return courierRepository.save(courier);
    }

    @Override
    public Optional<Courier> update(Long id, Courier courier) {
        return courierRepository.findById(id).map(existing -> {
            existing.setName(courier.getName());
            existing.setPhone(courier.getPhone());
            existing.setActive(courier.getActive());
            return courierRepository.save(existing);
        });
    }

    @Override
    public Optional<Courier> deleteById(Long id) {
        Optional<Courier> courier = courierRepository.findById(id);
        courier.ifPresent(courierRepository::delete);
        return courier;
    }
}
