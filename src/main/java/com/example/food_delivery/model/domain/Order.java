package com.example.food_delivery.model.domain;

import com.example.food_delivery.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
// SMENETO CELO TREBA DA SE VIDI KAKO KE SE VKLOPI
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    // Legacy field for compatibility with existing UI (flat list of Products)
    @ManyToMany
    private List<Product> Products = new ArrayList<>();

    // New canonical order items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Totals & fees
    private Double subtotal = 0.0;
    private Double deliveryFee = 0.0;
    private Double platformFee = 0.0;
    private Double discount = 0.0;
    private Double total = 0.0;

    @Embedded
    private Address deliveryAddress;

    @ManyToOne
    private Restaurant restaurant; // set from first item

    private Instant placedAt;

    public Order(User user) {
        this.user = user;
        this.status = OrderStatus.PENDING;
    }

    public void confirm() {
        this.status = OrderStatus.CONFIRMED;
        this.placedAt = Instant.now();
    }

    public void cancel() {
        this.status = OrderStatus.CANCELED;
    }

    public void recalcTotals() {
        double sub = 0.0;
        if (items != null && !items.isEmpty()) {
            for (OrderItem it : items) {
                sub += it.getLineTotal();
            }
        } else if (Products != null && !Products.isEmpty()) {
            for (Product d : Products) {
                sub += (d.getPrice() != null ? d.getPrice() : 0.0);
            }
        }
        subtotal = round2(sub);
        double totalCalc = subtotal + (deliveryFee != null ? deliveryFee : 0.0) + (platformFee != null ? platformFee : 0.0) - (discount != null ? discount : 0.0);
        total = round2(Math.max(totalCalc, 0.0));
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<Product> getProducts() {
        return Products;
    }

    public void setProducts(List<Product> products) {
        Products = products;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public Double getPlatformFee() {
        return platformFee;
    }

    public void setPlatformFee(Double platformFee) {
        this.platformFee = platformFee;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Address getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(Address deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Instant getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(Instant placedAt) {
        this.placedAt = placedAt;
    }
}
