import re
import time
from Code.Globals import GlobalData  # Globals 클래스 가져오기

class YawCalculator:
    def __init__(self):
        self.yaw = 0.0  # 초기 Yaw 값
        self.prev_time = None  # 이전 시간 초기화
        self.imu_pattern = re.compile(r"Accel: x=(-?\d+), y=(-?\d+), z=(-?\d+); Gyro: x=(-?\d+), y=(-?\d+), z=(-?\d+)")  # 정규 표현식
        self.gyro_scale = 2000  # 자이로 스케일 설정 (dps)
        self.sensitivity = 32768 / self.gyro_scale  # 자이로 센서 민감도

    def calculate_yaw(self, gz, dt):
        """자이로 데이터를 사용하여 Yaw(Z축 회전 각도) 계산"""
        # 자이로 데이터(gz)를 민감도에 따라 보정
        angular_velocity = gz / self.sensitivity  # 각속도 계산 (dps 단위)
        yaw_change = angular_velocity * dt  # dt(초 단위) 동안의 각도 변화
        self.yaw += yaw_change  # Yaw 값 누적

        # Yaw 값은 -180° ~ 180°로 제한
        if self.yaw > 180:
            self.yaw -= 360
        elif self.yaw < -180:
            self.yaw += 360

        return self.yaw

    def parse_and_calculate_yaw(self, raw_data):
        """수신된 IMU 데이터에서 Yaw 계산"""
        match = self.imu_pattern.match(raw_data)
        if match:
            # Z축 자이로 데이터 추출
            _, _, _, _, _, gyro_z = map(int, match.groups())

            # 현재 시간 계산
            current_time = time.time()
            if self.prev_time is None:
                # 이전 시간이 없으면 현재 시간을 저장하고 0 반환
                self.prev_time = current_time
                return self.yaw

            # 시간 간격 계산
            dt = current_time - self.prev_time
            self.prev_time = current_time

            # Yaw 계산
            yaw = self.calculate_yaw(gyro_z, dt)
            GlobalData.error += 1
            yaw -= GlobalData.error * 0.05
            # Globals를 통해 Yaw 값 업데이트
            GlobalData.update_yaw(yaw)

            # 디버깅 정보 출력
            print(f"Yaw: {yaw:.2f}°")

            return yaw
        else:
            raise ValueError("Failed to parse IMU data")
