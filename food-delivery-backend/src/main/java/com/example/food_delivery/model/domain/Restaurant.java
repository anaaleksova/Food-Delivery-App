package com.example.food_delivery.model.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Embedded
    private Address address;

    @Embedded
    private Coordinates coordinates;

    private String openHours; // e.g. JSON or "Mon-Fri 09:00-21:00; Sat-Sun 10:00-20:00"
    private Integer deliveryTimeEstimate; // in minutes
    private Boolean isOpen = true;
    private String imageUrl;
    private String category;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryZone> deliveryZones = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant")
    private List<Product> Products = new ArrayList<>();

    public Restaurant(String name, String description) {
        this.name=name;
        this.description=description;
    }
    public Restaurant(){}

    public Restaurant(String name, String description, String openHours, String imageUrl, String category,Integer deliveryTimeEstimate) {
        this.name = name;
        this.description = description;
        this.openHours = openHours;
        this.imageUrl = imageUrl;
        this.category = category;
        this.deliveryTimeEstimate=deliveryTimeEstimate;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public String getOpenHours() {
        return openHours;
    }

    public void setOpenHours(String openHours) {
        this.openHours = openHours;
    }

    public Integer getDeliveryTimeEstimate() {
        return deliveryTimeEstimate;
    }

    public void setDeliveryTimeEstimate(Integer deliveryTimeEstimate) {
        this.deliveryTimeEstimate = deliveryTimeEstimate;
    }

    public Boolean getIsOpen() {
        return isOpen;
    }

    public void setIsOpen(Boolean open) {
        isOpen = open;
    }

    public List<DeliveryZone> getDeliveryZones() {
        return deliveryZones;
    }

    public void setDeliveryZones(List<DeliveryZone> deliveryZones) {
        this.deliveryZones = deliveryZones;
    }

    public List<Product> getProducts() {
        return Products;
    }

    public void setProducts(List<Product> products) {
        Products = products;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
