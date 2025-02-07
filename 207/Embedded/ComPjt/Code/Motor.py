# -*- coding: utf-8 -*-

from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
import board
import busio
import time
from adafruit_servokit import ServoKit
from Code.Pwmthrottle import PWMThrottleHat
from .Globals import GlobalData


class Motor:

    def __init__(self):
        self.i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(self.i2c)
        self.pca.frequency = 60
        self.motor_hat = PWMThrottleHat(self.pca, channel=0)
        self.speed = 0.5
        self.angle = 100
        # 서보 모터 제어 설정
        self.kit = ServoKit(channels=16, i2c=self.i2c, address=0x60)
        self.kit.servo[0].angle = self.angle
        self.motor_hat.set_throttle(0)
        #로봇팔용servo
        #ang = 100
        #kit.servo[8].angle = ang

    def go(self):
        self.motor_hat.set_throttle(-1 * self.speed)

    def back(self):
        self.motor_hat.set_throttle(self.speed)

    def stop(self):
        self.motor_hat.set_throttle(0)

    def steer(self):
        if self.angle <= 50: 
            self.angle = 50
        if self.angle >= 150: 
            self.angle = 150
        self.kit.servo[0].angle = self.angle


    def self_control(self, data):
        min_s = 0
        max_s = 1
        mid_a = 50

        try:
            self.speed = float(abs(float(data.y)) * (max_s - min_s) + min_s)
            #self.speed = min(self.speed, max_s)
            if float(data.y) <= 0:
                self.go()
            else:
                self.back()
            
            # 회전 제어 (x축)
            if not dir:
                self.steer(0)
                return 1
            
            self.angle = (data.x * mid_a) + 100
            # 속도에 따른 회전 각도 조정
            #self.angle = self.angle * (1 - abs(data.y) * 0.5)
            self.steer()

            print(self.speed)
            print(self.angle)
            return 1
            
        except Exception as e:
            print(e)
            return 0
        
    def turn_around(self):
        yaw = GlobalData.yaw  # 현재 Yaw 값 가져오기
        print(f"Current Yaw: {yaw:.2f}°")

        # 목표 Yaw 값 설정
        target_yaw = yaw + 180
        if target_yaw > 180:
            target_yaw -= 360  # Yaw 값은 -180° ~ 180°로 제한
        print(f"Target Yaw: {target_yaw:.2f}°")

        self.angle = 150  # steer: 우회전
        self.steer()
        self.speed = 0.5  # 전진 속도 설정
        self.go()
        # 회전 로직
        while abs(target_yaw - yaw) > 90:
            yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
            time.sleep(0.1)
        self.stop()
        time.sleep(0.1)
        # 후진 시 좌회전
        self.angle = 50  # steer: 좌회전 (반대 방향)
        self.steer()
        self.back()
        while abs(target_yaw - yaw) > 5: 
            yaw = GlobalData.yaw
            time.sleep(0.1) 
        self.stop()
        time.sleep(0.1)

        # 회전 완료 후 정지
        self.stop()
        print("180-degree turn complete.")

    def auto_control(self, marker):

        yaw = GlobalData.yaw  # 현재 Yaw 값 가져오기
        print(f"Current Yaw: {yaw:.2f}°")

        # 목표 Yaw 값을 설정
        target_yaw = None

        if marker == 0:  #직진
            self.speed = 0.5
            self.go()
        elif marker == 1:
            self.angle = 100
            self.speed = 0.3
            self.steer()
            self.go()
        elif marker == 2:  # 우회전
            target_yaw = yaw + 90
            if target_yaw > 180:
                target_yaw -= 360  # Yaw 값은 -180° ~ 180°로 제한
        elif marker == 4:  # 좌회전
            target_yaw = yaw - 90
            if target_yaw < -180:
                target_yaw += 360  # Yaw 값은 -180° ~ 180°로 제한
        elif marker == 5:  # 정지
            self.stop()
            return

        # 목표 Yaw 값이 설정된 경우 회전 수행
        if target_yaw is not None:
            print(f"Target Yaw: {target_yaw:.2f}°")
            while abs(target_yaw - yaw) > 5:  # 목표 Yaw 값에 근접할 때까지 회전
                yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
                yaw_error = target_yaw - yaw

                # 회전 방향에 따른 steer 값 조정
                if yaw_error > 0:  # 우회전
                    self.angle = min(150, 100 + abs(yaw_error))
                else:  # 좌회전
                    self.angle = max(50, 100 - abs(yaw_error))
                
                self.steer()
                self.speed = 0.3
                self.go()

                print(f"Yaw Error: {yaw_error:.2f}°, Speed: {self.speed}, Angle: {self.angle}")
                time.sleep(0.1)  # 작은 간격으로 반복

            # 목표 각도에 도달하면 정지
            self.stop()
            print("Rotation complete.")

            
motor = Motor()
