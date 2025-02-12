import json

class Globals:
    _instance = None  # private 클래스 변수

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # 여기서는 기본 초기화만 수행
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        # 첫 초기화일 때만 실행
        if not self._initialized:
            self.frame = None
            self.aiframe = None
            self.ids = None
            self.videocamera = None
            self.jsondata = ""
            self._initialized = True
            self.marker = -1
            # self.motor = Motor()
            self.info = None
            self.yaw = 0.0  # Yaw 값을 저장할 변수
            self.mode = None


    def load_data(self):
        try:
            with open('basedata.json', 'r', encoding='utf-8') as f:
                self.jsondata = json.load(f)
        except FileNotFoundError:
            print("파일을 찾을 수 없습니다.")
        except PermissionError:
            print("파일을 읽을 권한이 없습니다.")
        except Exception as e:
            print(f"파일을 읽는 중 오류가 발생했습니다: {e}")
    
    def update_yaw(self, yaw_value):
        """Yaw 값을 업데이트"""
        self.yaw = yaw_value

# 싱글톤 인스턴스 생성
GlobalData = Globals()
