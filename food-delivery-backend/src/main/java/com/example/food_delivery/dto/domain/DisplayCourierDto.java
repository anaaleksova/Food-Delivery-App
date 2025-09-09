package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Courier;

public class DisplayCourierDto {
    private Long id;
    private String name;
    private Boolean active;

    public DisplayCourierDto(String name, Boolean active) {
        this.name = name;
        this.active = active;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public static DisplayCourierDto from(Courier courier) {
        return new DisplayCourierDto(
                courier.getName(),
                courier.getActive()
        );
    }
}
