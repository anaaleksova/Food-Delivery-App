package com.example.food_delivery.service.domain.impl;

import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.exceptions.IncorrectPasswordException;
import com.example.food_delivery.model.exceptions.UsernameAlreadyExistsException;
import com.example.food_delivery.repository.UserRepository;
import com.example.food_delivery.service.domain.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(User user) {
        if (findByUsername(user.getUsername()).isPresent())
            throw new UsernameAlreadyExistsException(user.getUsername());

        return userRepository.save(new User(
                user.getUsername(),
                passwordEncoder.encode(user.getPassword()),
                user.getName(),
                user.getSurname(),
                user.getEmail()
        ));
    }

    @Override
    public User login(String username, String password) {
        User user = findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new IncorrectPasswordException();
        return user;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

}
