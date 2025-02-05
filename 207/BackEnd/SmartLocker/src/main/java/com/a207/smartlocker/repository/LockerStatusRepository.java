package com.a207.smartlocker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.a207.smartlocker.model.entity.LockerStatus;

public interface LockerStatusRepository extends JpaRepository<LockerStatus, Long> {

}