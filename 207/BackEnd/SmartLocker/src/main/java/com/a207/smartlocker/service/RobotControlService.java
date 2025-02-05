package com.a207.smartlocker.service;

public interface RobotControlService {
    boolean controlRobot(Long robotId, Long lockerId, String action);
}
