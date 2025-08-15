package com.example.food_delivery.model.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer quantity;

    @ManyToOne
    private Restaurant restaurant;

    // marketplace additions DALI DA SE DODADAT VO KONSTRUKTOR I OPSTO?
    private Boolean isAvailable = true;
    private String category="";
    private String imageUrl="";

    public Product() {
    }

    public Product(String name, String description, Double price, Integer quantity, Restaurant restaurant) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.restaurant = restaurant;
    }

    public void increaseQuantity(){ if (quantity == null) quantity = 0;
    quantity += 1;
    }

    public void decreaseQuantity() {
        if (quantity == null) quantity = 0;
        if (quantity <= 0) throw new IllegalStateException("Out of stock for Product " + id);
        quantity -= 1;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
