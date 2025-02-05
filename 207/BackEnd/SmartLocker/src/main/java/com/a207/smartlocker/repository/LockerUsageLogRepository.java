package com.a207.smartlocker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.a207.smartlocker.model.entity.LockerUsageLog;

import java.util.Optional;

public interface LockerUsageLogRepository extends JpaRepository<LockerUsageLog, Long> {
    Optional<LockerUsageLog> findFirstByLocker_LockerIdAndStoreRobotIdIsNull(Long lockerId);
    Optional<LockerUsageLog> findFirstByLocker_LockerIdAndRetrieveRobotIdIsNull(Long lockerId);
}
