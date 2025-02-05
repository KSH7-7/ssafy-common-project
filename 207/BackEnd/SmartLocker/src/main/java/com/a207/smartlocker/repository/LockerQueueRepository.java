package com.a207.smartlocker.repository;

import com.a207.smartlocker.model.entity.LockerQueue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LockerQueueRepository extends JpaRepository<LockerQueue, Long> {
    Optional<LockerQueue> findFirstByOrderByQueueIdAsc();
}
