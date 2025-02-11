package com.a207.smartlocker.repository;

import com.a207.smartlocker.model.dto.LockerUsageLogResponse;
import com.a207.smartlocker.model.dto.UserUsageResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import com.a207.smartlocker.model.entity.LockerUsageLog;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LockerUsageLogRepository extends JpaRepository<LockerUsageLog, Long> {
    Optional<LockerUsageLog> findFirstByLocker_LockerIdAndStoreRobotIdIsNull(Long lockerId);
    Optional<LockerUsageLog> findFirstByLocker_LockerIdAndRetrieveRobotIdIsNull(Long lockerId);

    @Query("SELECT new com.a207.smartlocker.model.dto.UserUsageResponse(l.user.userId, l.user.phoneNumber, COUNT(l)) " +
            "FROM LockerUsageLog l " +
            "GROUP BY l.user.userId, l.user.phoneNumber " +
            "ORDER BY 1")
    List<UserUsageResponse> findUserUsageStatistics();

    @Query("SELECT l " +
            "FROM LockerUsageLog l " +
            "WHERE l.storeTime BETWEEN :startDate AND :endDate " +
            "ORDER BY l.logId ")
    List<LockerUsageLog> findByStoreTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
