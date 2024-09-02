package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.UserQuery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserQueryRepository extends JpaRepository<UserQuery, Long> {
}