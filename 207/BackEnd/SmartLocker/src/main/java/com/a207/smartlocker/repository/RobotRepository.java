package com.a207.smartlocker.repository;

import com.a207.smartlocker.model.dto.RobotResponse;
import com.a207.smartlocker.model.entity.Robot;
import com.a207.smartlocker.model.entity.RobotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RobotRepository extends JpaRepository<Robot, Long> {
    @Query(value = "UPDATE robots r SET robot_status_id = :newStatusId " +
            "WHERE r.robot_id IN (SELECT r2.robot_id FROM robots r2 WHERE r2.robot_status_id = :currentStatusId LIMIT 1) " +
            "RETURNING *",
            nativeQuery = true)
    Optional<Robot> findAndUpdateRobotStatus(@Param("currentStatusId") Long currentStatusId,
                                             @Param("newStatusId") Long newStatusId);

    @Modifying
    @Query("UPDATE Robot r SET r.robotStatus.robotStatusId = :newStatusId, "+
            "r.completedTasks = r.completedTasks + 1 WHERE r.robotId = :robotId")
    void updateRobotStatusAndCompletedTasks(@Param("robotId") Long robotId, @Param("newStatusId") Long newStatusId);

    @Query("SELECT r FROM Robot r ORDER BY r.robotId ASC")
    List<Robot> findAllByOrderByRobotIdAsc();
}

