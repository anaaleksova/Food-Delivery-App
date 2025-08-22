package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.OrderItem;
import com.example.food_delivery.model.domain.Product;
import com.example.food_delivery.model.exceptions.ProductOutOfStockException;
import com.example.food_delivery.repository.OrderItemRepository;
import com.example.food_delivery.repository.OrderRepository;
import com.example.food_delivery.repository.ProductRepository;
import com.example.food_delivery.service.domain.OrderTotalsService;
import com.example.food_delivery.service.domain.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
//SMENETO
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderTotalsService orderTotalsService;

    public ProductServiceImpl(ProductRepository ProductRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           OrderTotalsService orderTotalsService) {
        this.productRepository = ProductRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderTotalsService = orderTotalsService;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product save(Product Product) {
        return productRepository.save(Product);
    }

    @Override
    public Optional<Product> update(Long id, Product updated) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPrice(updated.getPrice());
            existing.setQuantity(updated.getQuantity());
            existing.setRestaurant(updated.getRestaurant());
            existing.setIsAvailable(updated.getIsAvailable());
            existing.setCategory(updated.getCategory());
            existing.setImageUrl(updated.getImageUrl());
            return productRepository.save(existing);
        });
    }

    @Override
    public Optional<Product> deleteById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        product.ifPresent(productRepository::delete);
        return product;
    }

    @Override
    @Transactional
    public Order addToOrder(Product product, Order order) {
        if (product.getQuantity() == null || product.getQuantity() <= 0 || Boolean.FALSE.equals(product.getIsAvailable())) {
            throw new ProductOutOfStockException(product.getId());
        }

        // Single-restaurant policy
        if (order.getRestaurant() != null) {
            Long currentRestaurantId = order.getRestaurant().getId();
            //if (!currentRestaurantId.equals(Product.getRestaurant().getId())) {
            //    throw new IllegalStateException("Cart can contain Products from only one restaurant.");
            //}
        }

        // Set order restaurant from first item
        if (order.getRestaurant() == null) {
            order.setRestaurant(product.getRestaurant());
        }

        // Reserve stock immediately
        product.decreaseQuantity();
        productRepository.save(product);

        // Legacy: also maintain flat list for compatibility
        order.getProducts().add(product);

        // New: add or increment OrderItem
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(1);
        item.setUnitPriceSnapshot(product.getPrice());
        order.getItems().add(item);
        orderItemRepository.save(item);

        // Recalculate totals with fees
        order.recalcTotals();
        // naive fee application using restaurant's first zone or 0
        orderTotalsService.setFeesAndRecalculate(order, order.getRestaurant());

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order removeFromOrder(Product Product, Order order) {
        // Remove one unit
        // Find an OrderItem for this Product
        OrderItem target = order.getItems().stream()
                .filter(it -> it.getProduct().getId().equals(Product.getId()))
                .findFirst().orElse(null);
        if (target != null) {
            order.getItems().remove(target);
            orderItemRepository.delete(target);
        }

        // Legacy removal
        order.getProducts().remove(Product);

        // Restock
        Product.increaseQuantity();
        productRepository.save(Product);

        // Recalculate
        order.recalcTotals();
        orderTotalsService.setFeesAndRecalculate(order, order.getRestaurant());

        return orderRepository.save(order);
    }
}
