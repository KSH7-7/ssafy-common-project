  // app/control/[robot_id]/page.tsx
  "use client";

  import React, { useState, useEffect, useRef } from "react";
  import { useParams, useRouter } from "next/navigation";
  import { io, Socket } from "socket.io-client";

  export default function RobotControlPage() {
    const params = useParams();
    const router = useRouter();
    const robot_id = params.robot_id;

    if (!robot_id) {
      return <p>로봇은 어디에...</p>; // 로봇 ID가 없을 때 로딩 표시
    }

    // 조이스틱 상태 관리
    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const radius = 50; // 조이스틱 이동 가능 반경

    // 웹캠 영상용 ref
    const videoRef = useRef<HTMLVideoElement>(null);

    // WebSocket 관련 ref
    const socketRef = useRef<Socket | null>(null);
    const sendInterval = useRef<NodeJS.Timeout | null>(null);

    // 웹캠 활성화
    useEffect(() => {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("웹캠을 사용할 수 없습니다:", error);
        }
      };

      startWebcam();

      // 클린업: 컴포넌트 언마운트 시 스트림 해제
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }, []);

    useEffect(() => {
      const socket = io("http://70.12.245.25:${robot_id}", {
        path: "/socket.io/",
        query: { robot_id },
        transports: ["websocket"],
      });
    
      socketRef.current = socket; // 여기가 중요
    
      socket.on("connect", () => {
        console.log("Socket.IO 연결됨:", socket.id);
      });
    
      socket.on("disconnect", () => {
        console.log("Socket.IO 끊김");
      });
    
      return () => {
        socket.disconnect();
      };
    }, [robot_id]);

    // 조이스틱 위치를 주기적으로 전송
    useEffect(() => {
      // socketRef.current가 null이 아니고 연결 상태일 때
      if (socketRef.current && socketRef.current.connected) {
        // 주기적으로 조이스틱 좌표 emit
        sendInterval.current = setInterval(() => {
          const { x, y } = joystickPosition;

          // 콘솔에 출력
          console.log(`Sending joystick position: x=${x}, y=${y}`);
          
          socketRef.current?.emit("joystick-move", { x, y });
        }, 30); // 30ms마다 emit
      }

      return () => {
        if (sendInterval.current) {
          clearInterval(sendInterval.current);
        }
      };
    }, [joystickPosition]);

    const handleMouseDown = () => {
      setIsDragging(true); // 드래그 시작
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isDragging) return; // 드래그 중일 때만 실행

      const rect = event.currentTarget.getBoundingClientRect();
      const rawX = event.clientX - rect.left - rect.width / 2;
      const rawY = event.clientY - rect.top - rect.height / 2;

      // 원형 경계 계산
      const distance = Math.sqrt(rawX ** 2 + rawY ** 2);
      if (distance > radius) {
        // 원 밖이면, 원 경계에 위치하도록 조정
        const angle = Math.atan2(rawY, rawX);
        setJoystickPosition({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      } else {
        // 원 안이면, 그대로 위치 설정
        setJoystickPosition({ x: rawX, y: rawY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false); // 드래그 종료
      setJoystickPosition({ x: 0, y: 0 }); // 조이스틱 핸들을 원래 위치로 되돌림
    };

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <button onClick={() => router.back()} style={{ marginBottom: "20px" }}>
          뒤로 가기
        </button>

        <div
          style={{
            margin: "0 auto",
            maxWidth: "400px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <p>로봇 ID: {robot_id}</p>
          <img
            // 비디오 소스 URL 확인 필요(src={`http://70.12.245.25/${robot_id}/video_feed`})
            src={`http://70.12.245.25:${robot_id}/video_feed`}
            alt="Jetson Orin Nano Stream"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
          <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              margin: "30px auto",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "#333",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                left: `calc(50% + ${joystickPosition.x}px - 25px)`,
                top: `calc(50% + ${joystickPosition.y}px - 25px)`,
                width: "50px",
                height: "50px",
                background: "#aaa",
                borderRadius: "50%",
                pointerEvents: "auto",
                cursor: "grab",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
