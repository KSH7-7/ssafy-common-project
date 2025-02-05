#Camera.py
"""
Camera.py 콜백 함수를 부르면, 사진을 저장하고, 그 프래임을 가져와야 한다.

즉, Camera.py 자체는 싱글폰 패턴을 가져야하며, 시간 값에 따라 일정 시간 단위로

새롭게 카메라를 촬영해야한다.
"""

import cv2
from .Globals import GlobalData

class Camera:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        # self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        # self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        # self.cap.set(cv2.CAP_PROP_FPS, 30)
        if not self.cap.isOpened():
            raise RuntimeError("카메라를 열 수 없습니다.")
        print("Camera Start")


    def Make_Frame(self):
        ret, frame = self.cap.read()
        if not ret:
            print("[Camera.py] Error, Not Reading Camera")
        else:
            if frame is not None:
                GlobalData.frame = frame
camera = Camera()