package com.example.food_delivery.dto.domain;

import com.example.food_delivery.model.domain.User;

public record RegisterUserRequestDto(
        String username,
        String password,
        String name,
        String surname,
        String email
) {

    public User toUser() {
        return new User(username, password, name, surname, email);
    }

}
