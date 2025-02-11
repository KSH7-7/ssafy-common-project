package com.a207.smartlocker.serviceImpl;

import com.a207.smartlocker.model.dto.*;
import com.a207.smartlocker.model.entity.Certification;
import com.a207.smartlocker.model.entity.LockerUsageLog;
import com.a207.smartlocker.model.entity.Robot;
import com.a207.smartlocker.repository.CertificationRepository;
import com.a207.smartlocker.repository.LockerUsageLogRepository;
import com.a207.smartlocker.repository.RobotRepository;
import com.a207.smartlocker.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final CertificationRepository certificationRepository;
    private final RobotRepository robotRepository;
    private final LockerUsageLogRepository lockerUsageLogRepository;

    @Override
    public AdminLoginResponse login(AdminLoginRequest request) {
        Optional<Certification> certificationOpt = certificationRepository
                .findByAdminIdAndAdminPassword(request.getAdminId(), request.getAdminPassword());

        if (certificationOpt.isPresent()) {
            return new AdminLoginResponse(true, "로그인 성공");
        }
        return new AdminLoginResponse(false, "아이디 또는 비밀번호가 일치하지 않습니다");
    }

    @Override
    public List<RobotResponse> getAllRobots() {
        return robotRepository.findAllByOrderByRobotIdAsc().stream()
                .map(RobotResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserUsageResponse> getUserUsageStatistics() {
        return lockerUsageLogRepository.findUserUsageStatistics();
    }

    @Override
    public List<LockerUsageLogResponse> getUsageLogByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return lockerUsageLogRepository.findByStoreTimeBetween(startDate, endDate).stream()
                .map(LockerUsageLogResponse::from)
                .collect(Collectors.toList());
    }
}