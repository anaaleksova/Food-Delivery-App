package com.example.food_delivery.dto.domain;

import lombok.Data;

@Data
public class PasswordDto {
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
