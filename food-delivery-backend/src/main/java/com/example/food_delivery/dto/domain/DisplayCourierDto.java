package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.Courier;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisplayCourierDto {
    private Long id;
    private String name;
    private Boolean active;

    public DisplayCourierDto(String name, Boolean active) {
        this.name = name;
        this.active = active;
    }

    public static DisplayCourierDto from(Courier courier) {
        return new DisplayCourierDto(
                courier.getName(),
                courier.getActive()
        );
    }
}
