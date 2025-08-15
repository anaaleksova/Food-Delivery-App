package com.example.food_delivery.model.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Order order;

    @ManyToOne(optional = false)
    private Product Product;

    private Integer quantity = 1;

    private Double unitPriceSnapshot;

    public Double getLineTotal() {
        double price = unitPriceSnapshot != null ? unitPriceSnapshot : (Product != null ? Product.getPrice() : 0.0);
        int qty = quantity != null ? quantity : 0;
        return price * qty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public com.example.food_delivery.model.domain.Product getProduct() {
        return Product;
    }

    public void setProduct(com.example.food_delivery.model.domain.Product product) {
        Product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPriceSnapshot() {
        return unitPriceSnapshot;
    }

    public void setUnitPriceSnapshot(Double unitPriceSnapshot) {
        this.unitPriceSnapshot = unitPriceSnapshot;
    }
}
