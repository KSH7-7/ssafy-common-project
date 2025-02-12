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
        self.speed = 0.3
        self.angle = 100
        # 서보 모터 제어 설정
        self.kit = ServoKit(channels=16, i2c=self.i2c, address=0x60)
        self.kit.servo[0].angle = self.angle
        self.motor_hat.set_throttle(0)
        #로봇팔용servo
        self.arm = 40 #40~180
        self.kit.servo[8].angle = self.arm

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
        self.go()
        time.sleep(0.3)
        self.stop()
        time.sleep(1)
        while (self.arm < 150):
            self.arm += 1
            self.kit.servo[8].angle = self.arm
            time.sleep(0.01)
        
        time.sleep(10)
        # yaw = GlobalData.yaw  # 현재 Yaw 값 가져오기
        # print(f"Current Yaw: {yaw:.2f}°")

        # # 목표 Yaw 값 설정
        # target_yaw = yaw + 180
        # if target_yaw > 180:
        #     target_yaw -= 360  # Yaw 값은 -180° ~ 180°로 제한
        # print(f"Target Yaw: {target_yaw:.2f}°")

        # self.angle = 150  # steer: 우회전
        # self.steer()
        # self.speed = 0.5  # 전진 속도 설정
        # self.go()
        # # 회전 로직
        # while abs(target_yaw - yaw) > 90:
        #     yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
        #     time.sleep(0.1)
        # self.stop()
        # time.sleep(0.1)
        # # 후진 시 좌회전
        # self.angle = 50  # steer: 좌회전 (반대 방향)
        # self.steer()
        # self.back()
        # while abs(target_yaw - yaw) > 10: 
        #     yaw = GlobalData.yaw
        #     time.sleep(0.1) 
        # self.stop()
        # time.sleep(0.1)

        # # 회전 완료 후 정지
        # self.stop()
        # self.angle = 100  # steer: 좌회전 (반대 방향)
        # self.steer()
        self.go()
        print("180-degree turn complete.")

    def store(self, angle):
        #서보 조작해서 물건 내려놓기
        self.angle = 100
        self.steer()
        self.go()
        time.sleep(0.3)
        self.stop()
        while (self.arm > 40):
            self.arm -= 1
            self.kit.servo[8].angle = self.arm
            time.sleep(0.01)
        self.back()
        time.sleep(0.3)
        self.stop()

        yaw = GlobalData.yaw 
        if (angle == 150):
            target_yaw = yaw - 90
            if target_yaw < -180:
                target_yaw += 360
            self.angle = 50
        else :
            target_yaw = yaw + 90
            if target_yaw > 180:
                target_yaw -= 360 
            self.angle = 150
        self.speed = 0.5
        self.steer()
        self.back()
        while abs(target_yaw - yaw) > 45:
            yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
            time.sleep(0.1)
        self.stop()
        if (self.angle == 50):
            self.angle += 100
        else:
            self.angle -= 100
        self.go()
        while abs(target_yaw - yaw) > 5:
            yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
            time.sleep(0.1)
        self.stop()
        self.angle = 100
        self.steer()
        self.speed = 0.5
        self.go()
        GlobalData.mode = "Back"
        return

    def auto_control(self, marker):
        if (marker > 400):
            return
        if (GlobalData.mode == "Go"):
            if (marker < 10):
                if marker == 1:
                    if (GlobalData.info["locker_Id"] < 200): 
                        self.angle = 50
                    elif (GlobalData.info["locker_Id"] > 300):
                        self.angle = 150
                    else:
                        self.angle = 100
                elif marker == 2:  # 우회전
                    self.angle = 150
                elif marker == 3:  # 좌회전
                    self.angle = 50
                elif marker in [4, 5]:  
                    self.angle = 100
                self.speed = 0.5
                self.steer()
                self.go()
            elif (marker % 10 == 0) : 
                self.speed = 0.3
                self.go()
            elif (GlobalData.info["locker_Id"] - marker < 10):
                yaw = GlobalData.yaw 
                if (GlobalData.info["locker_Id"] - marker < 5):
                    target_yaw = yaw - 90
                    if target_yaw < -180:
                        target_yaw += 360  # Yaw 값은 -180° ~ 180°로 제한
                    self.angle = 150  # steer: 우회전
                else:
                    target_yaw = yaw + 90
                    if target_yaw > 180:
                        target_yaw -= 360 
                    self.angle = 50
                self.steer()
                self.speed = 0.5  # 전진 속도 설정
                self.go()
                # 회전 로직
                while abs(target_yaw - yaw) > 45:
                    yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
                    time.sleep(0.1)
                self.stop()
                if (self.angle == 50):
                    self.angle += 100
                else:
                    self.angle -= 100
                self.back()
                while abs(target_yaw - yaw) > 5:
                    yaw = GlobalData.yaw  # 현재 Yaw 값 업데이트
                    time.sleep(0.1)
                self.stop()
                self.store(self.angle)

        elif (GlobalData.mode == "Back") :
            if marker in [4, 3]:
                self.angle = 50
            elif marker in [2, 5]:
                self.angle = 150
            self.speed = 0.5
            self.steer()
            self.go()
            if marker == 1:  
                # self.angle = 100
                # self.speed = 0.3
                # self.steer()
                # self.go()
                self.stop()
                GlobalData.mode = "Ready"

        return

motor = Motor()
