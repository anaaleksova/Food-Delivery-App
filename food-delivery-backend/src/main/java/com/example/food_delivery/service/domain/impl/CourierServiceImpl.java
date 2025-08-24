package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Courier;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.enums.OrderStatus;
import com.example.food_delivery.repository.CourierRepository;
import com.example.food_delivery.repository.OrderRepository;
import com.example.food_delivery.service.domain.CourierService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourierServiceImpl implements CourierService {

    private final CourierRepository courierRepository;
    private final OrderRepository orderRepository;

    public CourierServiceImpl(CourierRepository courierRepository, OrderRepository orderRepository) {
        this.courierRepository = courierRepository;
        this.orderRepository = orderRepository;
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
    public Optional<Courier> findByUsername(String username) {
        return courierRepository.findByUser_Username(username);
    }
    @Override
    public Courier save(Courier courier) {
        return courierRepository.save(courier);
    }

    @Override
    public Optional<Courier> update(Long id, Courier courier) {
        return courierRepository.findById(id).map(existing -> {
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

    @Override
    @Transactional
    public Order assignToOrder(String courierUsername, Long orderId) {
        Courier courier = courierRepository.findByUser_Username(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        if (!courier.getActive()) {
            throw new RuntimeException("Courier is already busy with another delivery");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException("Order must be confirmed to assign courier");
        }

        // Set courier as busy and update order status
        courier.setActive(false);
        order.setStatus(OrderStatus.PICKED_UP);
        order.setCourier(courier);

        courierRepository.save(courier);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order completeDelivery(String courierUsername, Long orderId) {
        Courier courier = courierRepository.findByUser_Username(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCourier().getId().equals(courier.getId())) {
            throw new RuntimeException("This order is not assigned to you");
        }

        // Mark courier as available and order as delivered
        courier.setActive(true);
        order.setStatus(OrderStatus.DELIVERED);
        order.setDeliveredAt(LocalDateTime.now());

        courierRepository.save(courier);
        return orderRepository.save(order);
    }

    @Override
    public List<Courier> findAvailable() {
        return courierRepository.findAllActiveCouriers();
    }
    @Override
    public List<Order> findDeliveredOrders(String courierUsername)
    {
        return orderRepository.findByCourierUsernameAndDelivered(courierUsername);
    }

}
