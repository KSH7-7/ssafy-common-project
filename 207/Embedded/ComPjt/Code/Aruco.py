import cv2
import numpy as np

from Code.Globals import GlobalData

class Aruco:

    # ArUco 사전 생성
    def __init__(self):
        self.aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_1000)
        self.parameters = cv2.aruco.DetectorParameters()
        self.detector = cv2.aruco.ArucoDetector(self.aruco_dict, self.parameters)
        # ArUco 검출기 생성
        print("Aruco Marker Start")
        pass

    def detect_aruco(self):
    # 마커 검출
        frame = GlobalData.frame
        if frame is None:
            return
        corners, ids, rejected = self.detector.detectMarkers(frame)        
        if ids is not None:
        # 검출된 마커 테두리와 ID 표시
            cv2.aruco.drawDetectedMarkers(frame, corners, ids)
            # 각 마커의 ID 출력
            GlobalData.ids = ids
            for i in range(len(ids)):
                print(f"Detected marker ID: {ids[i][0]}")
                if ( GlobalData.marker != ids[i][0]) :
                    GlobalData.marker = ids[i][0]
                    print("[Aruco.py] change marker mode")
                    GlobalData.motor.auto_control(GlobalData.marker)
                    # 주행 제어
            
aruco = Aruco()
