package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.enums.OrderStatus;
import com.example.food_delivery.model.exceptions.EmptyOrderException;
import com.example.food_delivery.model.exceptions.UserNotFoundException;
import com.example.food_delivery.repository.OrderRepository;
import com.example.food_delivery.repository.UserRepository;
import com.example.food_delivery.service.domain.OrderService;
import com.example.food_delivery.service.domain.OrderTotalsService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

//OVA GO SMENIV SO OD CHAT IMA DODATOCI VO LOGIKA KAKO RECALCULATE TOTALS
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderTotalsService orderTotalsService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            OrderTotalsService orderTotalsService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderTotalsService = orderTotalsService;
    }

    @Override
    public Optional<Order> findPending(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return orderRepository.findByUserAndStatus(user, OrderStatus.PENDING);
    }

    @Override
    @Transactional
    public Order findOrCreatePending(String username) {
        return findPending(username).orElseGet(() -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException(username));
            Order order = new Order(user); // status=PENDING
            order.recalcTotals();
            return orderRepository.save(order);
        });
    }

    @Override
    @Transactional
    public Optional<Order> confirm(String username) {
        Optional<Order> orderOpt = findPending(username);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            boolean hasItems = (order.getItems() != null && !order.getItems().isEmpty()) ||
                    (order.getProducts() != null && !order.getProducts().isEmpty());
            if (!hasItems) {
                throw new EmptyOrderException();
            }
            // Recalc before confirm
            order.recalcTotals();
            // Optional: apply fees one last time
            orderTotalsService.setFeesAndRecalculate(order, order.getRestaurant());
            order.confirm();
            return Optional.of(orderRepository.save(order));
        }
        return Optional.empty();
    }

    @Override
    @Transactional
    public Optional<Order> cancel(String username) {
        Optional<Order> orderOpt = findPending(username);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            boolean hasItems = (order.getItems() != null && !order.getItems().isEmpty()) ||
                    (order.getProducts() != null && !order.getProducts().isEmpty());
            if (!hasItems) {
                throw new EmptyOrderException();
            }
            order.cancel();
            return Optional.of(orderRepository.save(order));
        }
        return Optional.empty();
    }
}
