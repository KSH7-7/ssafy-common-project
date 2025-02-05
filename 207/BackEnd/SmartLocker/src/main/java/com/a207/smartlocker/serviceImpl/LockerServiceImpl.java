package com.a207.smartlocker.serviceImpl;


import com.a207.smartlocker.model.dto.RetrieveRequest;
import com.a207.smartlocker.model.dto.RetrieveResponse;
import com.a207.smartlocker.model.entity.*;
import com.a207.smartlocker.repository.*;
import com.a207.smartlocker.exception.custom.NotFoundException;
import com.a207.smartlocker.model.dto.StorageRequest;
import com.a207.smartlocker.model.dto.StorageResponse;
import com.a207.smartlocker.service.LockerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class LockerServiceImpl implements LockerService {
    private final UserRepository userRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final LockerRepository lockerRepository;
    private final LockerStatusRepository lockerStatusRepository;
    private final RobotRepository robotRepository;
    private final LockerUsageLogRepository lockerUsageLogRepository;
    private final RobotControlServiceImpl robotControlService;
    private final LockerQueueRepository lockerQueueRepository;

    @Override
    public StorageResponse storeItem(StorageRequest request) {
        // 1. 사용자 확인/생성
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseGet(() -> userRepository.save(User.builder()
                        .phoneNumber(request.getPhoneNumber())
                        .build()));

        // 2. 6자리 토큰 생성
        int tokenValue = generateRandomToken();
        AccessToken accessToken = accessTokenRepository.save(AccessToken.builder()
                .tokenValue((long) tokenValue)
                .build());

        // 3. 락커 상태 업데이트
        Locker locker = lockerRepository.findByLockerId(request.getLockerId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사물함 번호입니다."));

        LockerStatus status = lockerStatusRepository.findById(2L)
                .orElseThrow(() -> new NotFoundException("LockerStatus not found"));

        locker.updateLockerStatus(status, accessToken);
        lockerRepository.save(locker);

        // 4. 락커 큐에 추가
        LockerQueue lockerQueue = lockerQueueRepository.save(LockerQueue.builder()
                .lockerId(locker)
                .requestType("Store")
                .build());

        // 5. 사용 로그 생성
        LockerUsageLog usageLog = LockerUsageLog.builder()
                .locker(locker)
                .user(user)
                .storeTime(LocalDateTime.now())
                .build();
        lockerUsageLogRepository.save(usageLog);

        // 6. 결과 리턴
        return StorageResponse.builder()
                .lockerId(locker.getLockerId())
                .tokenValue(accessToken.getTokenValue())
                .message(request.getLockerId() + "번 보관함의 보관 요청 완료")
                .build();
    }

    @Override
    public RetrieveResponse retrieveItem(RetrieveRequest request) throws Exception {
        // 1. 락커 조회
        Locker locker = lockerRepository.findById(request.getLockerId())
                .orElseThrow(() -> new Exception("해당 락커를 찾을 수 없음: " + request.getLockerId()));

        // 2. 토큰 확인
        Long tokenId = locker.getTokenId();
        if (tokenId == null) {
            throw new Exception("사용중인 라커가 아님: " + request.getLockerId());
        }

        AccessToken accessToken = accessTokenRepository.findById(tokenId)
                .orElseThrow(() -> new Exception("토큰을 찾을 수 없음: " + tokenId));

        if (accessToken.getTokenValue() != request.getTokenValue()) {
            throw new Exception("토큰 불일치: " + request.getLockerId());
        }

        // 3. 락커 큐에 추가
        LockerQueue lockerQueue = lockerQueueRepository.save(LockerQueue.builder()
                .lockerId(locker)
                .requestType("Retrieve")
                .build());

        // 4. 결과 리턴
        return RetrieveResponse.builder()
                .lockerId(request.getLockerId())
                .message(request.getLockerId() + "번 보관함의 수령 요청 완료")
                .build();
    }

    @Override
    public List<Locker> getLockersByLocation(String locationName) {
        return lockerRepository.findLockersByLocationName(locationName);
    }

    private int generateRandomToken() {
        return 100000 + new Random().nextInt(900000);
    }
}