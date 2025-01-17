from flask import Flask, request, jsonify, json

class FlaskServer:
    def __init__(self, sensor_callback):
        self.app = Flask(__name__)
        self.routes()
        self.sensor_callback = sensor_callback
    
    def handle_device_request(self):
        data = request.get_json()
        result = self.sensor_callback(data)
        response = {
            "success": "성공" if result == 1 else "실패",
            "message": "작동" if result == 1 else "오류",
            "status_code": 200 if result == 1 else 202
        }
        return jsonify(response), response["status_code"]

    def routes(self):
        # 기본 라우트들
        @self.app.route('/rasp', methods=['POST'])
        def lcd():
            return self.handle_device_request()
             
    def get_app(self):
        return self.app
    
    def run(self, host='0.0.0.0', port=5001, debug=True):
        self.app.run(host=host, port=port, debug=debug)