"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Joystick from "./JoystickWrapper"; // wrapper 파일에서 default export로 가져옴
import Button from "@mui/material/Button";

// Joystick 이벤트 타입 정의
interface JoystickEvent {
  x: number;
  y: number;
}

export default function RobotControlPage() {
  const params = useParams();
  const router = useRouter();
  const robot_id = params.robot_id;

  const [joystickData, setJoystickData] = useState({ x: 0, y: 0 });
  const [socketConnected, setSocketConnected] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isRightHanded, setIsRightHanded] = useState(false); // 좌우 전환 상태

  const socketRef = useRef<Socket | null>(null);
  const sendInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!robot_id) return;
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

  const handleMove = (event: JoystickEvent) => {
    setJoystickData({ x: event.x, y: event.y });
  };

  const handleStop = () => {
    setJoystickData({ x: 0, y: 0 });
  };

  const handleStopCommand = () => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("stop");
    } else {
      console.error("정지 명령을 보낼 수 없음");
    }
  };

  // 좌우 전환 버튼 핸들러
  const toggleHandedness = () => {
    setIsRightHanded((prev) => !prev);
  };

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
          width: "90%",
          maxWidth: "650px",
          height: "600px", // 카드 높이 고정
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // 내부 요소 간격 유지
          alignItems: "center",
          overflow: "hidden", // 내부가 넘치지 않도록 제한
        }}
      >
        <p style={{ flex: "none" }}>로봇 ID: {robot_id}</p>

        <div
          style={{
            flexGrow: 1,
            width: "100%",
            border: "2px dashed #ccc",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: videoError ? "#f8f8f8" : "transparent",
            position: "relative",
          }}
        >
          <video
            src={`http://70.12.245.25:${robot_id}/video_feed`}
            muted
            playsInline
            autoPlay
            onError={() => setVideoError(true)}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              objectFit: "contain",
            }}
          ></video>
          {videoError && (
            <p
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "red",
                fontSize: "20px",
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "10px 15px",
                borderRadius: "8px",
              }}
            >
              캠이 오프라인입니다.
            </p>
          )}
        </div>

        {/* 좌우 전환 버튼 */}
        <Button
          variant="outlined"
          onClick={toggleHandedness}
          style={{ marginBottom: "20px" }} // 기존보다 살짝 아래로 조정
        >
          {isRightHanded ? "우수" : "좌수"}
        </Button>

        {/* 조이스틱과 정지 버튼 */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly", // 적절한 간격 유지
            alignItems: "center",
            gap: "80px", // 기존보다 약간 더 멀리 배치
          }}
        >
          {/* 정지 버튼 (빨간 원형) */}
          {!isRightHanded ? (
            <Button
              onClick={handleStopCommand}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              정지
            </Button>
          ) : null}

          {/* 조이스틱 */}
          <Joystick
            size={100}
            baseColor="#333"
            stickColor="#aaa"
            move={handleMove}
            stop={handleStop}
          />

          {/* 정지 버튼 위치 변경 */}
          {isRightHanded ? (
            <Button
              onClick={handleStopCommand}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              정지
            </Button>
          ) : null}
        </div>

        {!socketConnected && <p>소켓 연결 중...</p>}
      </div>
    </div>
  );
}
