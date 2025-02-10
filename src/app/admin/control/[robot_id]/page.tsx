"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Joystick } from "react-joystick-component";
import Button from "@mui/material/Button";

// 2. any 대신 사용할 타입을 정의 (예: JoystickEvent)
interface JoystickEvent {
  x: number;
  y: number;
}

export default function RobotControlPage() {
  const params = useParams();
  const router = useRouter();
  const robot_id = params.robot_id;
  const robot_name = params.robot_name;

  const [joystickData, setJoystickData] = useState({ x: 0, y: 0 });
  const [socketConnected, setSocketConnected] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const sendInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!robot_id) return; // robot_id가 없으면 연결하지 않음
    const socket = io(`http://70.12.245.25:${robot_id}`, {
      path: "/socket.io/",
      query: { robot_id },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("response_event", (data) => {
      console.log("메시지 받음:", data);
    });

    socket.on("connect", () => {
      console.log("Socket 연결됨");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket 끊김");
      setSocketConnected(false);
    });

    return () => {
      socket.off("response_event");
      socket.disconnect();
    };
  }, [robot_id]);

  // 조이스틱 데이터를 주기적으로 전송하는 훅
  useEffect(() => {
    if (!robot_id) return;
    if (socketRef.current && socketRef.current.connected) {
      sendInterval.current = setInterval(() => {
        const { x, y } = joystickData;
        if (x === 0 && y === 0) return;
        console.log(`Sending joystick position: x=${x}, y=${y}`);
        socketRef.current?.emit("joystick-move", { x, y });
      }, 300);
    }

    return () => {
      if (sendInterval.current) {
        clearInterval(sendInterval.current);
      }
    };
  }, [joystickData, socketConnected, robot_id]);

  // 조이스틱 이벤트 핸들러 (타입을 지정하여 any 사용 문제 해결)
  const handleMove = (event: JoystickEvent) => {
    setJoystickData({ x: event.x, y: event.y });
  };

  const handleStop = () => {
    setJoystickData({ x: 0, y: 0 });
  };

  // 정지 명령 전송
  const handleStopCommand = () => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("stop");
    } else {
      console.error("정지 명령을 보낼 수 없음");
    }
  };

  // 모든 훅은 호출된 후에, robot_id가 없으면 대체 UI를 렌더링
  if (!robot_id) {
    return <p>로봇은 어디에...</p>;
  }

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
        <p>
          로봇 ID: {robot_id} / 로봇명 : {robot_name}
        </p>

        {/* 로봇 비디오 스트림 표시 */}
        <video
          src={`http://70.12.245.25:${robot_id}/video_feed`}
          muted
          playsInline
          autoPlay
          onError={() => setVideoError(true)}
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        ></video>
        {videoError && <p>비디오 스트림을 불러올 수 없습니다.</p>}

        {/* 정지 버튼 */}
        <Button variant="outlined" color="error" onClick={handleStopCommand}>
          정지
        </Button>

        {/* 조이스틱 컨트롤 */}
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
          <Joystick
            size={100}
            baseColor="#333"
            stickColor="#aaa"
            move={handleMove}
            stop={handleStop}
          />
        </div>

        {!socketConnected && <p>소켓 연결 중...</p>}
      </div>
    </div>
  );
}
