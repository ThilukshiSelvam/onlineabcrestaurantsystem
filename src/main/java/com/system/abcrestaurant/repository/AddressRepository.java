package com.system.abcrestaurant.repository;

import com.system.abcrestaurant.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
