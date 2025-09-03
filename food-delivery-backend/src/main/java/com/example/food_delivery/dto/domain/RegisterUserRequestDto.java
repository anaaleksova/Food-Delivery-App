package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.enums.Role;

public record RegisterUserRequestDto(
        String username,
        String password,
        String name,
        String surname,
        String email,
        Role role
) {

    public User toUser() {
        return new User(username, password, name, surname, email,role);
    }

}
