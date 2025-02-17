"""
main.py

메인 Py => 각 모듈을 불러와서 연결한다. 
 카메라, 차량 제어 + 상하차, 기타, AI, 서버, 맵

메인 코드는 기능에 포함된 내용에 대해 모듈화를 통해 설계한다.

이를 통해 결합도는 낮추고 응집도는 높이게 설계한다.

각 기능 중 폴링 방식이 필요한 코드는 쓰레드를 이용하여 분배한다.

AI가 사용할 카메라는 하나고 AI 모델은 여러 개를 사용하기 때문에, 카메라를 분리하여 카메라 사진을 통해 분석하도록 설계한다.
"""
import os
import threading
import signal
import sys
import time
from types import SimpleNamespace
from Code.Server import Server
from Code.Timer import Timer
from Code.Camera import camera
from Code.Aruco import aruco
from Code.Motor import motor
from Code.Traffic_Ai import traffic
from Code.Imu import ImuProcessor


#from Code.Senser import Callback

program = []
server = None
imu_processor = None

def cleanup():
    """ 모든 실행 중인 모듈을 안전하게 종료하는 함수 """
    global server, imu_processor

    print("\n🔻 프로그램 종료 중...")

    if server:
        server.stop()

    for task in program:
        task.stop()

    if imu_processor:
        imu_processor.stop()

    print("✅ 모든 프로세스가 종료되었습니다.")
    os._exit(0)  # 즉시 프로세스 종료
    
def signal_handler(signum, frame):
    cleanup()

    
def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    

    #motor에서 callback를 활용하기 쉽게 한번에 함수를 묶어 넘겨줌.
    callback = SimpleNamespace(stop=motor.stop, control=motor.self_control)

    # Flask 서버를 위한 스레드 생성
    server = Server(callback)
    server_thread = threading.Thread(
        #콜백 함수 인자 전달 하지 않으면, None.
        target=lambda: server.run_server(), daemon=True
    )
    server_thread.start()

    # IMU 데이터 처리용 스레드 생성
    imu_processor = ImuProcessor(port="/dev/ttyTHS0", baudrate=115200)
    imu_thread = threading.Thread(target=imu_processor.start, daemon=True)
    imu_thread.start()

    # 주기적으로 사진 촬영 (0.1 : 0.1초)
    camera_call = Timer(0.1, camera.Make_Frame)
    # 주기적으로 마커 인식 시도
    aruco_call = Timer(0.5,aruco.detect_aruco)
    # 신호등 AI 모델
    #traffic_call = Timer(1,traffic.detect)
    program.extend([camera_call, aruco_call])

    for i in program:
        i.start()
    # 메인 프로그램 코드
    try: 
        while True:
            # 여기에 메인 로직 작성
            # 지금은 종료 방지용으로 작성하였고, 필요 시 log 및 현재 실행중인 프로세스 정보 등 다양하게 활용가능
            time.sleep(1) 
            pass
    except KeyboardInterrupt:
        cleanup() 

if __name__ == "__main__":
    main()
