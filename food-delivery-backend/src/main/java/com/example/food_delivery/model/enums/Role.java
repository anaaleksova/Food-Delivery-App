package com.example.food_delivery.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ROLE_CUSTOMER,
    ROLE_OWNER,
    ROLE_ADMIN
    ;

    @Override
    public String getAuthority() {
        return name();
    }
}
