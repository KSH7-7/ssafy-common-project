"use client";

import React, { useState } from "react";

export default function RobotControlPage() {
  const robot_id = "ef92la211p3";

  // 조이스틱 상태 관리
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [sensitivity, setSensitivity] = useState(1); // 감도 설정 (1: 기본, 2: 두 배, 0.5: 절반)

  const radius = 50; // 조이스틱 이동 가능 반경

  const handleMouseDown = () => {
    setIsDragging(true); // 드래그 시작
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return; // 드래그 중일 때만 실행

    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = event.clientX - rect.left - rect.width / 2;
    const rawY = event.clientY - rect.top - rect.height / 2;

    // 감도 적용
    const adjustedX = rawX * sensitivity;
    const adjustedY = rawY * sensitivity;

    // 원형 경계 계산
    const distance = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY);
    if (distance > radius) {
      // 원 밖이면, 원 경계에 위치하도록 조정
      const angle = Math.atan2(adjustedY, adjustedX);
      setJoystickPosition({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    } else {
      // 원 안이면, 그대로 위치 설정
      setJoystickPosition({ x: adjustedX, y: adjustedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
    setJoystickPosition({ x: 0, y: 0 }); // 조이스틱 핸들을 원래 위치로 되돌림
  };

  const handleSensitivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSensitivity = parseFloat(event.target.value);
    setSensitivity(newSensitivity);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={() => alert("뒤로 가기 버튼 클릭됨")} style={{ marginBottom: "20px" }}>
        뒤로 가기
      </button>
      <p>로봇 ID: {robot_id}</p>
      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          margin: "10px auto",
          width: "80%",
        }}
      >
        <h2>웹캠 출력</h2>
      </div>
      <p>현재 속도: 80.5 mph</p>

      {/* 감도 설정 */}
      <div style={{ margin: "20px" }}>
        <label>
          감도:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={sensitivity}
            onChange={handleSensitivityChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <span style={{ marginLeft: "10px" }}>{sensitivity.toFixed(1)}</span>
      </div>

      {/* 조이스틱 UI */}
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
        {/* 조이스틱 핸들 */}
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
      <h1> r</h1>
      <h1>q </h1>
      <h1> w</h1>
      <h1> f`</h1>
      <h1> a</h1>

    </div>
  );
}
