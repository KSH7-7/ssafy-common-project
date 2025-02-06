import cv2
import numpy as np
import time
from Code.Globals import GlobalData
class YOLO:
    def __init__(self):
        # YOLO 네트워크 로드
        self.config_path = "/home/ssafy/Downloads/Embedded/ComPjt/Ai_Model/traffic_light/yolov4-tiny.cfg"
        self.weights_path = "/home/ssafy/Downloads/Embedded/ComPjt/Ai_Model/traffic_light/yolov4-tiny_last.weights"
        self.classes_path = "/home/ssafy/Downloads/Embedded/ComPjt/Ai_Model/traffic_light/obj.name"
        self.net = cv2.dnn.readNet(self.weights_path, self.config_path)
        if cv2.cuda.getCudaEnabledDeviceCount() > 0:
            self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
            self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA_FP16)
        else:
            self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_DEFAULT)
            self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
        
        # 클래스 이름 로드
        with open(self.classes_path, 'r', encoding='utf-8') as f:
            self.classes = [line.strip() for line in f.readlines()]
        
        # 각 클래스에 대한 랜덤 색상 생성
        self.colors = np.random.uniform(0, 255, size=(len(self.classes), 3))
        
        # 네트워크 레이어 가져오기
        self.layer_names = self.net.getLayerNames()
        self.output_layers = [self.layer_names[i-1] for i in self.net.getUnconnectedOutLayers()]

    def detect(self, conf_threshold=0.5, nms_threshold=0.4):
        frame = GlobalData.frame
        if frame is None:
            return
        height, width, _ = frame.shape
        
        # Blob 이미지 생성
        blob = cv2.dnn.blobFromImage(frame, 1/255.0, (320, 320), swapRB=True, crop=False)
        self.net.setInput(blob)
        
        # 객체 감지 실행
        outputs = self.net.forward(self.output_layers)
        
        # 감지 결과를 저장할 리스트
        boxes = []
        confidences = []
        class_ids = []
        
        # 감지된 객체 정보 추출
        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                
                if confidence > conf_threshold:
                    # 바운딩 박스 좌표 계산
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    
                    # 바운딩 박스의 왼쪽 상단 좌표
                    x = int(center_x - w/2)
                    y = int(center_y - h/2)
                    
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        
        # Non-maximum suppression 적용
        indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)
        if len(indices) > 0:
            print("결과 감지")
            for i in indices.flatten():
                label = self.classes[class_ids[i]]
                if label == "vehicular_signal-yellow":
                    print("노란 신호입니다. 변화에 대응하세요.")
                elif label ==  "vehicular_signal-green":
                    print("초록 신호입니다. 주행하세요.")
                elif label == "vehicular_signal-red":
                    print("빨간 신호입니다. 정지하세요.")
                else:
                    print("기타 신호를 인식하였습니다.")
            print("")
        """
        if len(indices) > 0:
            for i in indices.flatten():
                x, y, w, h = boxes[i]
                label = self.classes[class_ids[i]]
                confidence = confidences[i]
                color = self.colors[class_ids[i]]
                
                # 바운딩 박스 그리기
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                
                # 클래스 이름과 정확도 표시
                text = f'{label}: {confidence:.2f}'
                cv2.putText(frame, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        """
        # 결과 시각화
        GlobalData.aiframe = frame
traffic = YOLO()
