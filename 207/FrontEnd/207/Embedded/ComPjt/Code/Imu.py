import serial
import time
from Code.YawCalculator import YawCalculator
from Code.Globals import GlobalData


class ImuProcessor:
    """IMU 데이터를 처리하는 클래스"""

    def __init__(self, port="/dev/ttyTHS0", baudrate=115200):
        self.port = port
        self.baudrate = baudrate
        self.uart = None
        self.yaw_calculator = YawCalculator()
        self.running = False

    def start(self):
        """IMU 데이터 처리 시작"""
        try:
            self.uart = serial.Serial(self.port, baudrate=self.baudrate, timeout=1)
            print(f"IMU: Connected to {self.port} at {self.baudrate} baud rate.")
            self.running = True

            while self.running:
                if self.uart.in_waiting:
                    raw_data = self.uart.readline().decode('utf-8', errors='ignore').strip()
                    try:
                        yaw = self.yaw_calculator.parse_and_calculate_yaw(raw_data)
                        GlobalData.update_yaw(yaw)  # GlobalData에 Yaw 값 업데이트
                        #print(f"IMU: Yaw (Z-axis rotation): {yaw:.2f}°")
                    except ValueError as e:
                        print(f"IMU: Parsing error: {e}")
        except serial.SerialException as e:
            print(f"IMU: Error opening serial port {self.port}: {e}")
        except Exception as e:
            print(f"IMU: Unexpected error: {e}")
        finally:
            if self.uart and self.uart.is_open:
                self.uart.close()
                print("IMU: Serial port closed.")

    def stop(self):
        """IMU 데이터 처리 중단"""
        self.running = False
