package com.a207.smartlocker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.a207.smartlocker.model.entity.LockerLocation;

public interface LockerLocationRepository extends JpaRepository<LockerLocation, Long> {

}
