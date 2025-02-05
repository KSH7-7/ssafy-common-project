package com.a207.smartlocker.service;

import com.a207.smartlocker.model.dto.RobotTaskRequest;
import com.a207.smartlocker.model.dto.RobotTaskResponse;

public interface RobotTaskService {
    RobotTaskResponse processNextTask() throws Exception;
}
