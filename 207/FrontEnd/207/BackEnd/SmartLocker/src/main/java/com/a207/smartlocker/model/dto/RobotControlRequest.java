package com.a207.smartlocker.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RobotControlRequest {
    private Long robot_Id;
    private Long locker_Id;
    private String action;
}