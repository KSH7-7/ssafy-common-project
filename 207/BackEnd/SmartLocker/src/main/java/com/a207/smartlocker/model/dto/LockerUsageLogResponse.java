package com.a207.smartlocker.model.dto;

import com.a207.smartlocker.model.entity.LockerUsageLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LockerUsageLogResponse {
    private Long logId;
    private Long lockerId;
    private Long userId;
    private LocalDateTime storeTime;
    private Long storeRobotId;
    private LocalDateTime retrieveTime;
    private Long retrieveRobotId;

    public static LockerUsageLogResponse from(LockerUsageLog log) {
        return LockerUsageLogResponse.builder()
                .logId(log.getLogId())
                .lockerId(log.getLocker().getLockerId())
                .userId(log.getUser().getUserId())
                .storeTime(log.getStoreTime())
                .storeRobotId(log.getStoreRobotId() != null ? log.getStoreRobotId().getRobotId() : null)
                .retrieveTime(log.getRetrieveTime())
                .retrieveRobotId(log.getRetrieveRobotId() != null ? log.getRetrieveRobotId().getRobotId() : null)
                .build();
    }
}
