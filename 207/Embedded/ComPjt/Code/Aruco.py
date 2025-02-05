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

        # A207 카메라 전용 계수
        self.camera_matrix = np.array([[1.27021656e+03, 0.00000000e+00, 2.77607427e+02],
                            [0.00000000e+00,1.46129634e+03, 1.86265163e+02],
                            [0.00000000e+00, 0.00000000e+00, 1.00000000e+00]], dtype=np.float32)
    
        # 캘리브레이션된 왜곡 계수
        self.dist_coeffs = np.array([[ 0.51056657, -0.51291757, -0.02229919, -0.01838506, -4.32756949]], dtype=np.float32)

         # 마커 크기 (미터 단위) # 실제 마커크기 / 2 로 해야 잘 작동함.
        self.marker_size = 0.025  # 100mm = 0.1m  0.025 * 1000 = 25 (실제 마커 크기가 50mm이면 0.025)
        pass

    def detect_aruco(self):
    # 마커 검출
        frame = GlobalData.frame
        if frame is None:
            return
        corners, ids, rejected = self.detector.detectMarkers(frame)
  
        if ids is not None and len(ids) > 0:
        # 검출된 마커 테두리와 ID 표시
            cv2.aruco.drawDetectedMarkers(frame, corners, ids)
            # 각 마커의 ID 출력
            rvecs, tvecs, _ = cv2.aruco.estimatePoseSingleMarkers(
                    corners, self.marker_size, self.camera_matrix, self.dist_coeffs)
            GlobalData.ids = ids
            for i in range(len(ids)):
                print(f"Detected marker ID: {ids[i][0]}")
                distance = np.linalg.norm(tvecs[i])
                distance_cm = distance * 100
                print(f"\r마커 ID {ids[i][0]} 까지의 거리: {distance_cm:.1f}cm", end="", flush=True)
                if ( GlobalData.marker != ids[i][0]) :
                    GlobalData.marker = ids[i][0]
                    print("[Aruco.py] change marker mode")
                    GlobalData.motor.auto_control(GlobalData.marker)
                    # 주행 제어
            
aruco = Aruco()
