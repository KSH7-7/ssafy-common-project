# -*- coding: utf-8 -*-

from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
import board
import busio
import time
from adafruit_servokit import ServoKit
from Code.Pwmthrottle import PWMThrottleHat


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
        self.motor_hat.set_throttle(self.speed)

    def back(self):
        self.motor_hat.set_throttle(-1 * self.speed)

    def stop(self):
        self.motor_hat.set_throttle(0)

    def steer(self):
        if self.angle <= 50: 
            self.angle = 50
        if self.angle >= 150: 
            self.angle = 150
        self.kit.servo[0].angle = self.angle

    def steer_right(self):
        self.steer(130)

    def steer_left(self):
        self.steer(70)

    def steer_center(self):
        self.steer(100)


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

    def auto_control(self, marker):
        if (marker == 0):
            self.speed = 0.5
            self.go()
        elif (marker == 1):
            self.angle = 50
            self.steer()
        elif (marker == 2):
            self.angle = 150
            self.steer()
        elif (marker == 3):
            self.stop()

motor = Motor()