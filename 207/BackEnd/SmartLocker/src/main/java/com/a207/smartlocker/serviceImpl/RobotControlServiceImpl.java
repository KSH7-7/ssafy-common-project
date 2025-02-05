package com.a207.smartlocker.serviceImpl;

import com.a207.smartlocker.exception.custom.RobotControlException;
import com.a207.smartlocker.service.RobotControlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.HttpStatusCodeException;

@Service
public class RobotControlServiceImpl implements RobotControlService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String ROBOT_SERVER_URL = "http://70.12.245.25:5001/rasp";

    // DTO 클래스 생성
    @Data
    @Builder
    public static class RobotControlRequest {
        private Long robot_Id;
        private Long locker_Id;
        private String action;
    }

    public boolean controlRobot(Long robotId, Long lockerId, String action) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            RobotControlRequest request = RobotControlRequest.builder()
                    .robot_Id(robotId)
                    .locker_Id(lockerId)
                    .action(action)
                    .build();

            // 객체를 JSON 문자열로 직렬화
            String jsonRequest = objectMapper.writeValueAsString(request);
            System.out.println("JSON Request: " + jsonRequest);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(jsonRequest, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    ROBOT_SERVER_URL,
                    requestEntity,
                    String.class
            );

            return "done".equals(response.getBody());
        } catch (Exception e) {
            throw new RobotControlException("로봇 작동 중 예외가 발생하였습니다 : " + e.getMessage());
        }
    }
}