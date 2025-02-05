#Camera.py
"""
Camera.py 콜백 함수를 부르면, 사진을 저장하고, 그 프래임을 가져와야 한다.

즉, Camera.py 자체는 싱글폰 패턴을 가져야하며, 시간 값에 따라 일정 시간 단위로

새롭게 카메라를 촬영해야한다.
"""

import cv2
from .Globals import GlobalData

class Camera:
    def __init__(self, number):
        self.number = number
        self.cap = cv2.VideoCapture(self.number)
        if not self.cap.isOpened():
            raise RuntimeError("카메라를 열 수 없습니다.")
        print("Camera Start")


    def Make_Frame(self):
        ret, frame = self.cap.read()
        if not ret:
            print("[Camera.py] Error, Not Reading Camera")
        else:
            if frame is not None:
                if self.number == 0:
                    GlobalData.frame = frame
                elif self.number == 2:
                    GlobalData.subframe = frame