package com.a207.smartlocker.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RobotTaskRequest {
    private Long lockerId;
}