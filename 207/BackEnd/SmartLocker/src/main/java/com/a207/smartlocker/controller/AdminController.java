package com.a207.smartlocker.controller;

import com.a207.smartlocker.model.dto.*;
import com.a207.smartlocker.model.entity.LockerUsageLog;
import com.a207.smartlocker.model.entity.Robot;
import com.a207.smartlocker.service.AdminService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request, HttpSession httpSession) {
        AdminLoginResponse response = adminService.login(request);
        if (response.isSuccess()) {
            response.setSessionId(httpSession.getId());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/robots")
    public ResponseEntity<List<RobotResponse>> getRobots() {
        List<RobotResponse> robots = adminService.getAllRobots();
        return ResponseEntity.ok(robots);
    }

    @GetMapping("/user-usage")
    public ResponseEntity<List<UserUsageResponse>> getUserUsageStatistics() {
        List<UserUsageResponse> statistics = adminService.getUserUsageStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/usage-logs")
    public ResponseEntity<List<LockerUsageLogResponse>> login(@RequestBody DateRangeRequest request) {
        List<LockerUsageLogResponse> response = adminService.getUsageLogByDateRange(request.getStartDate(), request.getEndDate());
        return ResponseEntity.ok(response);
    }
}