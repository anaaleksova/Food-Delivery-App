package com.example.food_delivery.repository;

import com.example.food_delivery.model.domain.Order;
import com.example.food_delivery.model.domain.User;
import com.example.food_delivery.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByUserAndStatus(User user, OrderStatus status);
    @Query("SELECT o FROM Order o WHERE o.status = 'CONFIRMED' ORDER BY o.placedAt ASC")
    List<Order> findConfirmed();

    @Query("SELECT o FROM Order o WHERE o.status = 'CONFIRMED' AND o.courier IS NULL ORDER BY o.placedAt ASC")
    List<Order> findConfirmedUnassignedOrders();

    @Query("SELECT o FROM Order o WHERE o.courier.user.username = :courierUsername")
    List<Order> findByCourierUsername(@Param("courierUsername") String courierUsername);

}
