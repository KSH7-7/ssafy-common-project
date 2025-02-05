import cv2
import os
from datetime import datetime
from Traffic_Ai import YOLO
def main():
    # YOLO 모델 인스턴스 생성
    traffic = YOLO()
    
    # 비디오 파일 경로 설정
    input_path = "input.mp4"  # 실제 비디오 파일 경로로 변경
    output_dir = "analyzed_videos"  # 출력 디렉토리
    
    # 출력 디렉토리 생성
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_output_dir = os.path.join(output_dir, f"output_{timestamp}")
    os.makedirs(video_output_dir, exist_ok=True)
    
    # 비디오 캡처 객체 생성
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print("Error: 비디오 파일을 열 수 없습니다.")
        return
    
    # 비디오 속성 가져오기
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames_per_minute = fps * 60
    
    current_segment = 0
    current_writer = None
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # 새로운 1분 구간 시작
            if frame_count % frames_per_minute == 0:
                if current_writer is not None:
                    current_writer.release()
                
                output_path = os.path.join(
                    video_output_dir, 
                    f"segment_{current_segment:03d}.mp4"
                )
                current_writer = cv2.VideoWriter(
                    output_path,
                    cv2.VideoWriter_fourcc(*'mp4v'),
                    fps,
                    (frame_width, frame_height)
                )
                current_segment += 1
            
            # AI 분석 수행
            processed_frame = traffic.detect(frame)
            
            # 프레임 저장
            if current_writer is not None and processed_frame is not None:
                current_writer.write(processed_frame)
            
            # 진행상황 표시
            frame_count += 1
            if frame_count % fps == 0:  # 1초마다 진행상황 출력
                minutes_processed = frame_count / frames_per_minute
                total_minutes = total_frames / frames_per_minute
                print(f"처리 진행률: {(minutes_processed/total_minutes)*100:.1f}% "
                      f"({minutes_processed:.1f}/{total_minutes:.1f} 분)")
    
    except KeyboardInterrupt:
        print("\n사용자가 처리를 중단했습니다.")
    
    finally:
        # 리소스 정리
        if current_writer is not None:
            current_writer.release()
        cap.release()
        
        print(f"\n처리 완료!\n"
              f"출력 디렉토리: {video_output_dir}\n"
              f"생성된 세그먼트 수: {current_segment}")

if __name__ == "__main__":
    main()