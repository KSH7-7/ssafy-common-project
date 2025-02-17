package com.a207.smartlocker.model.dto;

import com.a207.smartlocker.model.entity.Robot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RobotResponse {
    private Long robotId;
    private String robotName;
    private Long completedTasks;
    private LocalDateTime lastMaintenance;
    private String robotStatus;

    public static RobotResponse from(Robot robot) {
        return new RobotResponse(
                robot.getRobotId(),
                robot.getRobotName(),
                robot.getCompletedTasks(),
                robot.getLastMaintenance(),
                robot.getRobotStatus().getRobotStatus()
        );
    }
}
