package com.a207.smartlocker.repository;

import com.a207.smartlocker.model.entity.Locker;
import com.a207.smartlocker.model.entity.LockerQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LockerQueueRepository extends JpaRepository<LockerQueue, Long> {
    Optional<LockerQueue> findFirstByOrderByQueueIdAsc();
    @Query("SELECT q FROM LockerQueue q WHERE q.requestType = 'Retrieve' ORDER BY q.queueId ASC LIMIT 20")
    List<LockerQueue> findFirst20QRetrieveQueues();

    Optional<LockerQueue> findByLockerIdAndRequestType(Locker locker, String requestType);
}
