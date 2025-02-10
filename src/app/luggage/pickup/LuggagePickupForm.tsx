"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"

// =============================================================================
// Styled Components
// =============================================================================

const StyledCard = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  min-height: 100vh;
  max-height: 150vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding-bottom: 120px;

  @media (max-width: 768px) {
    padding: 0;
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0;
    width: 100%;
  }

  @media (min-width: 1024px) {
    padding: 0;
    width: 100%;
  }
`;

const StyledCardHeader = styled.div`
  margin-bottom: 24px;
`;

const StyledCardTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`;

const StyledCardContent = styled.div`
  flex: 1;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #1975FF;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const StyledButton = styled.button<{ $isSelected?: boolean }>`
  padding: 16px 24px;
  border-radius: 8px;
  border: ${(props) => (props.$isSelected ? "none" : "1px solid #1975FF")};
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "transparent")};
  color: ${(props) => (props.$isSelected ? "white" : "#007bff")};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background-color: ${(props) =>
      props.$isSelected ? "#0056b3" : "#e6f2ff"};
  }

  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const NextButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`;

const BackButton = styled(StyledButton)`
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProgressBar = styled.div`
  height: 7px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
`;

const Progress = styled.div<{ $width: number }>`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: linear-gradient(to right, #4a1b9d, #00a3ff);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

// =============================================================================
// LuggagePickupMultiStepForm Component
// =============================================================================

export default function LuggagePickupMultiStepForm() {
  const router = useRouter();

  // 단계 상태 : (1) 입력, (2) 수령 완료
  const [currentStep, setCurrentStep] = useState(1);

  // 1단계: 사물함 번호와 인증번호 입력 상태
  const [lockerNumber, setLockerNumber] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 단계 핸들러 함수
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 1단계 제출 처리: 입력 데이터를 POST로 전송
  const handleUserInfoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lockerNumber && authCode) {
      try {
        const response = await fetch("/api/current_store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lockerId: Number(lockerNumber),
            tokenValue: Number(authCode),
          }),
        });
        if (!response.ok) {
          console.error("Error:", await response.text());
          return;
        }
        const data = await response.json();
        console.log("Success:", data);
        handleNextStep();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Submission error:", error.message);
        } else {
          console.error("Submission error:", error);
        }
      }
    }
  };

  // 스텝별 렌더링 함수 (case3, case4 제거)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>1단계: 사물함 정보 입력</StyledCardTitle>
            </StyledCardHeader>
            <form onSubmit={handleUserInfoSubmit}>
              <StyledInput
                type="number"
                placeholder="사물함 번호를 입력하세요"
                value={lockerNumber}
                onChange={(e) => setLockerNumber(e.target.value)}
              />
              <StyledInput
                type="number"
                placeholder="인증번호를 입력하세요"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <NextButton type="submit" disabled={!lockerNumber || !authCode}>
                제출
              </NextButton>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>수령 완료</StyledCardTitle>
            </StyledCardHeader>
            <p>사물함 {lockerNumber}의 수령이 완료되었습니다.</p>
            <NextButton type="button" onClick={() => router.push("/")}>
              홈으로 가기
            </NextButton>
          </>
        );
      default:
        return null;
    }
  };

  // =============================================================================
  // 컴포넌트 렌더링
  // =============================================================================

  return (
    <StyledCard>
      <ProgressBar>
        <Progress $width={(currentStep / 2) * 100} />
      </ProgressBar>
      <div style={{ backgroundColor: "#f5f5f5", padding: "16px" }}>
        {currentStep > 1 && (
          <BackButton type="button" onClick={handleBackStep}>
            이전
          </BackButton>
        )}
        <StyledCardContent>{renderStepContent()}</StyledCardContent>
      </div>
    </StyledCard>
  );
}