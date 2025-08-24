package com.example.food_delivery.service.application;

import com.example.food_delivery.dto.domain.LoginUserRequestDto;
import com.example.food_delivery.dto.domain.LoginUserResponseDto;
import com.example.food_delivery.dto.domain.RegisterUserRequestDto;
import com.example.food_delivery.dto.domain.RegisterUserResponseDto;
import com.example.food_delivery.model.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserApplicationService {
    Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto);

    Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto);

    Optional<RegisterUserResponseDto> findByUsername(String username);
    List<RegisterUserResponseDto> findAll();
}
