import time
from flask import Flask, request, jsonify, json, Response, render_template_string
from flask_socketio import SocketIO, emit
from types import SimpleNamespace
import cv2
from .Globals import GlobalData
from Code.Motor import motor


class Server:
    # 초기 생성 main.py -> server = server( ~ )을 실행할 때 실행되는 함수 init. 서버에서 모터를 조정해야할 함수를 callback, stop 처럼 추가하여 사용하면 됨
    def __init__(self, callback):
        self.app = Flask(__name__)
        self.callback = callback 
        self.socketio = SocketIO(self.app, cors_allowed_origins="*", ping_timeout=60, ping_interval=25)
        # 일반적인 https call을 담당함. Back에서 젯슨으로 요청하는 내용이 여기로 옴
        self.routes()
        print("Flask Server - Backend Connection Ready")
        # 웹 소켓: Front에서 요청하는 내용이 여기로 옴(반대로 전달도 가능능)
        self.setup_socketio()
        print("Flask Socket - Frontend Connection Ready")


    def stop(self):
        if self.socketio:
            self.socketio.stop()

    def setup_socketio(self):
        # 소켓 연결시 작동하는 함수
        @self.socketio.on('connect')
        def handle_connect():
            print('Frontend Client connected')
            emit('response', {'data': 'Connected'})

        # '{이름(joystick-move)}' 으로 웹소켓 전송 시 받을 수 있음 
        @self.socketio.on('stop')
        def nano_stop(data):
            self.callback.stop()
        @self.socketio.on('joystick-move')
        def catch_all(data):
            # data는 {x: value, y: value} 형태의 딕셔너리
            x = data.get('x')
            y = data.get('y')
            callbackdata = SimpleNamespace(**{'x': x, 'y': y})
            print(f'받은 데이터: x={x}, y={y}')

            # callback 함수 실행 => 모터
            self.callback.control(callbackdata) 
            return {'status': 'received', 'x': x, 'y': y}

    def response(self, flag):
        return {
            "success": "성공" if flag == 1 else "실패",
            "status_code": 200 if flag == 1 else 503 
        }

    # Back에서 여기서 만든 원하는 주소로 GET, POST를 하면 전달 받을 수 있음. 함수명은 자유대로, 자유롭게 삭제하셈.
    def routes(self):
        @self.app.route('/control/5001', methods=['GET'])
        def coord():
            return self.response(0)

        @self.app.route('/rasp', methods=['POST'])
        def lcd():
            print("요청받음")
            data = request.get_json()
            print(data)
            GlobalData.info = data
            GlobalData.mode = "Go"
            motor.turn_around()
            while (GlobalData.mode != "Ready"):
                time.sleep(0.1)
            return "done"

        #Back에서 연결 잘 됬는지 점검용
        @self.app.route('/')
        def hello():
            return "I M NANO JETSON"

        #AI 비전 확인용    
        @self.app.route('/video')
        def video():
            html = '''
            <html>
            <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
                <script>
                    var socket = io();
                    socket.on('connect', function() {
                        console.log('Connected to server');
                    });
                    socket.on('response', function(msg) {
                        console.log('Received:', msg.data);
                    });
                </script>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        background: #000;
                        overflow: hidden;
                    }
                    img {
                        width: 100vw;
                        height: 100vh;
                        object-fit: fill;
                    }
                    h1 {
                        position: absolute;
                        top: 20px;
                        left: 20px;
                        color: white;
                        font-family: Arial;
                        z-index: 1;
                    }
                </style>
            </head>
            <body>
                <h1>Video Streaming</h1>
                <img src="/video_feed" alt="Video Stream">
            </body>
            </html>
            '''
            return render_template_string(html)
        
        @self.app.route('/video_feed')
        def video_feed():
            return Response(self.generate_frames(0),
                          mimetype='multipart/x-mixed-replace; boundary=frame')
        
        @self.app.route('/video_ai_feed')
        def video_ai_feed():
            return Response(self.generate_frames(1),
                          mimetype='multipart/x-mixed-replace; boundary=frame')

    def generate_frames(self, data):
        while True:
            if data == 0:
                frame = GlobalData.frame
            else:
                frame = GlobalData.aiframe
            if frame is not None:
                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    frame = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    # 서버 포트 실행. => 5001 포트를 열어놨으며, 포트 변경시 EC2에서 포트를 확인할 필요가 있고, 터널링을 해뒀기 때문에 5001 유지 요망
    # 포트 변경 시 Jira 임베디드 외부 IP 연동 확인. 
    def run_server(self, host='0.0.0.0', port=5001, debug=False):
        self.socketio.run(self.app, host=host, port=port, debug=debug, use_reloader=False)
