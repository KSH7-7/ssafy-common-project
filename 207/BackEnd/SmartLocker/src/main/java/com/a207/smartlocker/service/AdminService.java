package com.a207.smartlocker.service;

import com.a207.smartlocker.model.dto.*;
import com.a207.smartlocker.model.entity.LockerUsageLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminService {
    AdminLoginResponse login(AdminLoginRequest request);
    List<RobotResponse> getAllRobots();
    List<UserUsageResponse> getUserUsageStatistics();
    List<LockerUsageLogResponse> getUsageLogByDateRange(LocalDateTime startDate, LocalDateTime endDate);
}
