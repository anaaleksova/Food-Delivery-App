package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Courier;

public class DisplayCourierDto {
    private Long id;
    private String name;
    private String phone;
    private Boolean active;

    public DisplayCourierDto(String name, String phone, Boolean active) {
        this.id = id;
        this.name = name;
        this.phone = phone;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
                courier.getPhone(),
                courier.getActive()
        );
    }
}
