package com.example.food_delivery.service.application.impl;

import com.example.food_delivery.dto.domain.AddressDto;
import com.example.food_delivery.dto.domain.DisplayOrderDto;
import com.example.food_delivery.dto.domain.OrderDto;
import com.example.food_delivery.model.domain.Address;
import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.Product;
import com.example.food_delivery.model.mapper.BasicMappers;
import com.example.food_delivery.repository.ProductRepository;
import com.example.food_delivery.service.application.OrderApplicationService;
import com.example.food_delivery.service.domain.OrderService;
import com.example.food_delivery.service.domain.OrderTotalsService;
import com.example.food_delivery.service.domain.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class OrderApplicationServiceImpl implements OrderApplicationService {

    private final OrderService orderDomain;
    private final ProductService ProductDomain;
    private final OrderTotalsService totalsDomain;
    private final ProductRepository productRepository;

    public OrderApplicationServiceImpl(OrderService orderDomain, ProductService productDomain, OrderTotalsService totalsDomain, ProductRepository productRepository) {
        this.orderDomain = orderDomain;
        ProductDomain = productDomain;
        this.totalsDomain = totalsDomain;
        this.productRepository = productRepository;
    }

    @Override
    public OrderDto getCart(String username) {
        Order cart = orderDomain.findOrCreatePending(username);
        return BasicMappers.toDto(cart);
    }

    @Override
    @Transactional
    public OrderDto addProductToCart(String username, Long ProductId) {
        Order cart = orderDomain.findOrCreatePending(username);
        Product product = productRepository.findById(ProductId).orElseThrow();
        Order updated = ProductDomain.addToOrder(product, cart);
        return BasicMappers.toDto(updated);
    }

    @Override
    @Transactional
    public OrderDto removeProductFromCart(String username, Long ProductId) {
        Order cart = orderDomain.findOrCreatePending(username);
        Product Product = productRepository.findById(ProductId).orElseThrow();
        Order updated = ProductDomain.removeFromOrder(Product, cart);
        return BasicMappers.toDto(updated);
    }

    @Override
    @Transactional
    public Optional<OrderDto> confirm(String username) {
        Order updated = orderDomain.confirm(username).orElseThrow();
        return Optional.of(BasicMappers.toDto(updated));
    }

    @Override
    @Transactional
    public Optional<OrderDto> cancel(String username) {
        Order updated = orderDomain.cancel(username).orElseThrow();
        return Optional.of(BasicMappers.toDto(updated));
    }

    @Override
    @Transactional
    public OrderDto setDeliveryAddress(String username, AddressDto address) {
        Order cart = orderDomain.findOrCreatePending(username);
        cart.setDeliveryAddress(address == null ? null : new Address(
                address.getLine1(), address.getLine2(), address.getCity(),
                address.getPostalCode(), address.getCountry()
        ));
        // Re-apply fee rules now that address may affect zones later (stub keeps same rule)
        totalsDomain.setFeesAndRecalculate(cart, cart.getRestaurant());
        return BasicMappers.toDto(cart);
    }

    @Override
    @Transactional
    public OrderDto applyDiscount(String username, Double discountAmount) {
        Order cart = orderDomain.findOrCreatePending(username);
        cart.setDiscount(discountAmount == null ? 0.0 : Math.max(0.0, discountAmount));
        totalsDomain.setFeesAndRecalculate(cart, cart.getRestaurant());
        return BasicMappers.toDto(cart);
    }

    @Override
    public DisplayOrderDto findOrCreatePending(String username) {
        return DisplayOrderDto.from(orderDomain.findOrCreatePending(username));
    }
}
