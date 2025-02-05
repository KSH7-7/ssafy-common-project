package com.a207.smartlocker.controller;

import com.a207.smartlocker.model.dto.RobotTaskRequest;
import com.a207.smartlocker.model.dto.RobotTaskResponse;
import com.a207.smartlocker.service.RobotTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/robot-tasks")
@RequiredArgsConstructor
public class RobotTaskController {
    private final RobotTaskService robotTaskService;

    @PostMapping("/process")
    public ResponseEntity<RobotTaskResponse> processRobotTask(@RequestBody RobotTaskRequest request) {
        try {
            RobotTaskResponse response = robotTaskService.processNextTask();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    RobotTaskResponse.builder()
                            .message("작업 수행 실패: " + e.getMessage())
                            .success(false)
                            .build()
            );
        }
    }
}