package com.a207.smartlocker.model.dto;

import com.a207.smartlocker.model.entity.LockerQueue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskQueueResponse {
    private Long taskQueueId;
    private Long lockId;
    private String requestType;

    public static TaskQueueResponse from(LockerQueue lockerQueue) {
        return new TaskQueueResponse(
                lockerQueue.getQueueId(),
                lockerQueue.getLockerId().getLockerId(),
                lockerQueue.getRequestType()
        );
    }
}
