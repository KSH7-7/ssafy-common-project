import re
import time
from Code.Globals import GlobalData  # Globals 클래스 가져오기

class YawCalculator:
    def __init__(self):
        self.yaw = 0.0  # 초기 Yaw 값
        self.prev_time = time.time()  # 이전 시간
        self.imu_pattern = re.compile(r"Accel: x=(-?\d+), y=(-?\d+), z=(-?\d+); Gyro: x=(-?\d+), y=(-?\d+), z=(-?\d+)")  # 정규 표현식

    def calculate_yaw(self, gz, dt):
        """자이로 데이터를 사용하여 Yaw(Z축 회전 각도) 계산"""
        self.yaw += gz * dt * 0.001  # 자이로 데이터(gz)는 초당 각도 변화 (dps), dt는 초 단위
        return self.yaw

    def parse_and_calculate_yaw(self, raw_data):
        """수신된 IMU 데이터에서 Yaw 계산"""
        match = self.imu_pattern.match(raw_data)
        if match:
            # Z축 자이로 데이터 추출
            _, _, _, _, _, gyro_z = map(int, match.groups())

            # 시간 간격 계산
            current_time = time.time()
            dt = current_time - self.prev_time
            self.prev_time = current_time

            # Yaw 계산
            yaw = self.calculate_yaw(gyro_z, dt)

            # Globals를 통해 Yaw 값 업데이트
            GlobalData.update_yaw(yaw)

            return yaw
        else:
            raise ValueError("Failed to parse IMU data")
