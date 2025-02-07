"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styled, { keyframes } from "styled-components"

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

  /* 미디어 쿼리 추가: 화면 크기에 따라 스타일 변경 */
  @media (max-width: 768px) {
    padding: 0; /* 작은 화면에서는 여백을 늘림 */
    width: 100%; /* 작은 화면에서는 너비를 90%로 설정 */
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0; /* 중간 화면 크기에서 여백을 증가 */
    width: 100%; /* 화면 크기가 커질수록 너비를 80%로 설정 */
  }

  @media (min-width: 1024px) {
    padding: 0; /* 큰 화면에서는 여백을 더 크게 설정 */
    width: 100%; /* 화면이 더 커지면 너비를 70%로 설정하여 카드가 더 커지도록 함 */
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

const StyledCardDescription = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
`;

const StyledCardContent = styled.div`
  flex: 1;
  max-height: calc(100vh - 00px); /* 헤더, 프로그레스바, 버튼 컨테이너 등 고정 요소들을 제외한 높이 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;

  /* 커스텀 스크롤바 디자인 */
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


const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #1975FF;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 24px;
`


const SubmitButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`

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
`

const NextButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`

const LockerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 16px;
`

const LockerButton = styled(StyledButton)`
  width: 100%;
  height: 50px;
`

// -----------------------------------------------------------------------------
// 새로운 진행률(Progress Bar) 관련 Styled Components
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Modal styled components
// -----------------------------------------------------------------------------

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
`

const ModalTitle = styled.h3`
  margin-bottom: 16px;
`

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`

// =============================================================================
// Fireworks Effect (simplified with CSS animation)
// =============================================================================

const fireworksAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(0.5); }
`

const FireworksContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 500;
`

const Firework = styled.div<{ color?: string }>`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color || "#ff0"};
  border-radius: 50%;
  animation: ${fireworksAnimation} 1s ease-out infinite;
`

function FireworksEffect() {
  // 랜덤 위치와 색상을 가진 도트 애니메이션 생성
  const fireworks = Array.from({ length: 20 }).map((_, index) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
    delay: Math.random(),
  }));

  return (
    <FireworksContainer>
      {fireworks.map((fw, index) => (
        <Firework
          key={index}
          style={{
            top: fw.top,
            left: fw.left,
            animationDelay: `${fw.delay}s`,
          }}
          color={fw.color}
        />
      ))}
    </FireworksContainer>
  );
}

// =============================================================================
// LuggagePickupMultiStepForm Component
// =============================================================================

export default function LuggagePickupMultiStepForm() {
  const router = useRouter();

  // 현재 단계 상태 (1 ~ 4)
  const [currentStep, setCurrentStep] = useState(1);

  // 1단계: 사물함 번호와 인증번호 상태
  const [lockerNumber, setLockerNumber] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 2단계: 사물함 더미 데이터
  const [dummyLockers] = useState([
    { lockerId: "L1", lockerStatus: "사용중" },
    { lockerId: "L2", lockerStatus: "사용중" },
    { lockerId: "L3", lockerStatus: "사용중" },
    { lockerId: "L4", lockerStatus: "사용중" },
  ]);
  const [confirmedLockers, setConfirmedLockers] = useState<string[]>([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  // 4단계: 자동 리디렉션을 위한 카운트다운
  const [countdown, setCountdown] = useState(5);

  // =============================================================================
  // 단계 관련 핸들러 함수
  // =============================================================================

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleUserInfoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lockerNumber && authCode) {
      try {
        const response = await fetch("http://i12a207.p.ssafy.io:8080/api/locker/retrieve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lockerNumber, authCode }),
        });
        if (!response.ok) {
          console.error("Error:", await response.text());
          return;
        }
        const data = await response.json();
        console.log("Success:", data);
        handleNextStep();
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
  };

  // 2단계: 사물함 클릭 시 모달 표시
  const handleLockerClick = (lockerId: string) => {
    setSelectedLocker(lockerId);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedLocker(null);
  };

  const handleModalConfirm = () => {
    if (selectedLocker && !confirmedLockers.includes(selectedLocker)) {
      setConfirmedLockers([...confirmedLockers, selectedLocker]);
    }
    setIsModalOpen(false);
    setSelectedLocker(null);
  };

  // =============================================================================
  // 4단계: 카운트다운을 통한 자동 네비게이션
  // =============================================================================

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 4) {
      setCountdown(5);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            router.push("/");
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, router]);

  // =============================================================================
  // 각 단계별 콘텐츠 렌더링 함수
  // =============================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>1단계: 사물함 번호와 인증번호 입력</StyledCardTitle>
            </StyledCardHeader>
            <form onSubmit={handleUserInfoSubmit}>
              <StyledInput
                type="text"
                placeholder="사물함 번호를 입력하세요"
                value={lockerNumber}
                onChange={(e) => setLockerNumber(e.target.value)}
              />
              <StyledInput
                type="text"
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
              <StyledCardTitle>2단계: 이용중인 사물함 선택</StyledCardTitle>
            </StyledCardHeader>
            <p>아래 목록에서 수령할 사물함을 선택하세요.</p>
            <LockerGrid>
              {dummyLockers.map((locker) => (
                <LockerButton
                  key={locker.lockerId}
                  type="button"
                  onClick={() => handleLockerClick(locker.lockerId)}
                  $isSelected={confirmedLockers.includes(locker.lockerId)}
                >
                  {locker.lockerId}
                </LockerButton>
              ))}
            </LockerGrid>
            {confirmedLockers.length > 0 && (
              <NextButton type="button" onClick={handleNextStep}>
                다음
              </NextButton>
            )}
          </>
        );
      case 3:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>3단계: 선택한 사물함 확인</StyledCardTitle>
            </StyledCardHeader>
            <p>다음 목록에서 수령하실 사물함을 확인하세요.</p>
            <LockerGrid>
              {confirmedLockers.map((lockerId) => (
                <div key={lockerId}>{lockerId}</div>
              ))}
            </LockerGrid>
            <NextButton
              type="button"
              onClick={handleNextStep}
              disabled={confirmedLockers.length === 0}
            >
              수령하기
            </NextButton>
          </>
        );
      case 4:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>수령완료!!</StyledCardTitle>
            </StyledCardHeader>
            <p>축하합니다! 짐 수령이 완료되었습니다.</p>
            {/* 폭죽 효과 */}
            <FireworksEffect />
            <NextButton type="button" onClick={() => router.push("/")}>
              홈으로 가기
            </NextButton>
            <p>{countdown}초 후 자동으로 홈으로 이동합니다.</p>
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
      {/* 진행률(Progress Bar) 렌더링 */}
      <ProgressBar>
        <Progress $width={(currentStep / 4) * 100} />
      </ProgressBar>
      <div style={{ backgroundColor: "#f5f5f5", padding: "16px" }}>
      {currentStep > 1 && currentStep < 4 && (
        <BackButton type="button" onClick={handleBackStep}>
          이전
        </BackButton>
      )}
      <StyledCardContent>

        
      </StyledCardContent>
      {renderStepContent()}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>수령하시겠습니까?</ModalTitle>
            <ModalButtonGroup>
              <StyledButton type="button" onClick={handleModalCancel}>
                취소
              </StyledButton>
              <StyledButton type="button" onClick={handleModalConfirm} $isSelected>
                확인
              </StyledButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
        
      </div>
      
    </StyledCard>
  )
}