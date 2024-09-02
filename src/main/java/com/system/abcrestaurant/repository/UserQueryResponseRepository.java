package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.UserQueryResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserQueryResponseRepository extends JpaRepository<UserQueryResponse, Long> {
}