"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { ArrowLeft, Home } from "lucide-react";

// Styled Components
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

const ButtonGridStep1 = styled.div` /* 1단계 전용 그리드 */
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
  width: 100%;

  @media (min-width: 640px) {
    gap: 40px;
  }
`;

const ButtonGridStep2 = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  width: 100%;
  overflow-y: auto;
  max-height: 400px;

  @media (max-width: 768px) {
    max-height: 300px; /* 작은 화면에서 max-height를 줄임 */
  }

  /* 화면 크기가 480px 이하일 때 max-height 더 줄임 */
  @media (max-width: 480px) {
    max-height: 200px; /* 더 작은 화면에서 max-height를 더 줄임 */
  }
`;

const LockerButtonStep1 = styled(StyledButton)` /* 1단계 버튼 */
  height: 100px;
  font-size: 24px;
  width: 100%;
`;

const LockerButtonStep2 = styled(StyledButton)`
  aspect-ratio: 1;
  min-width: 40px;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$isSelected ? "#007bff" : "transparent"};
  color: ${(props) => (props.$isSelected ? "white" : "#007bff")};
  border: 1px solid #007bff;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    color: #666;
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${(props) =>
      props.$isSelected ? "#0056b3" : "#e6f2ff"};
  }
`;


const PhoneInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.$color};
  border-radius: 2px;
`;

const Container = styled.div`
background-color: #f9f9f9; /* 연한 회색 배경 */
padding: 16px; /* 적당한 여백 추가 */
border-radius: 8px; /* 부드러운 테두리 */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
  }
`;

const NextStyledButton = styled(StyledButton)`
  background-color: #000880;
  border: 1.5px solid #1975FF;
  color: white;

  &:hover {
    background-color: #000880; /* You can adjust this if you want a different hover effect */
  }
`;

// API 응답 데이터 유형에 맞는 인터페이스
interface Space {
  lockerId: number;
  lockerStatus: string;
  lockerLocation: string;
}

export default function LuggageSaveForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [spaces, setSpaces] = useState<Space[]>([]);

  // 선택한 창고에 따라 API 요청 (useEffect를 통해 selectedLocker 변경 시 호출)
  useEffect(() => {
    if (typeof window !== "undefined" && selectedLocker) {
      fetchLockerStatus(selectedLocker);
    }
  }, [selectedLocker]);

  // API 요청 함수 (fetch를 이용)
  const fetchLockerStatus = async (locker: string) => {
    try {
      const response = await fetch(`http://70.12.246.128:8080/api/locker/${locker}/status`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.log("접근이 거부되었습니다. 권한을 확인해주세요.");
        } else {
          console.log("서버 연결에 실패했습니다.");
        }
        return;
      }

      const data = await response.json();
      setSpaces(
        data.map((lockerData: any) => ({
          lockerId: lockerData.lockerId,
          lockerStatus: lockerData.lockerStatus.lockerStatus,
          lockerLocation: lockerData.lockerLocation.locationName,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch locker status:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.log("접근이 거부되었습니다. 권한을 확인해주세요.");
        } else {
          console.log("서버 연결에 실패했습니다.");
        }
      }
    }
  };

  // 창고 선택 시 상태 업데이트 (useEffect가 API 호출을 진행)
  const handleLockerSelect = (locker: string) => {
    setSelectedLocker(locker);
  };

  const handleNextStep = () => {
    if (currentStep === 3 && !isValidPhoneNumber(phone)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isValidPhoneNumber = (input: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

const renderStepContent = () => {
  switch (currentStep) {
    case 1:
      return (
        <>
          <ButtonGridStep1>
            {["A", "B", "C"].map((locker) => (
              <LockerButtonStep1
                key={locker}
                type="button"
                $isSelected={selectedLocker === locker}
                onClick={() => handleLockerSelect(locker)}
              >
                {locker}
              </LockerButtonStep1>
            ))}
          </ButtonGridStep1>
        </>
      );
      case 2:
        return (
          <>
            <Container>
              <StyledCardTitle>2단계: 자리 선택</StyledCardTitle>
              <Legend>
                <LegendItem>
                  <LegendColor $color="white" />
                  <span>이용 가능</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor $color="#007bff" />
                  <span>선택됨</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor $color="#cccccc" />
                  <span>사용 중</span>
                </LegendItem>
              </Legend>
              <ButtonGridStep2>
                {spaces.map((space) => (
                  <LockerButtonStep2
                    key={space.lockerId}
                    type="button"
                    $isSelected={selectedSpace === space.lockerId}
                    disabled={space.lockerStatus === "사용중"}
                    onClick={() => setSelectedSpace(space.lockerId)}
                  >
                    {space.lockerId}
                  </LockerButtonStep2>
                ))}
              </ButtonGridStep2>
            </Container>
          </>
        );
    case 3:
      return (
        <>
          <StyledCardTitle>3단계: 사용자 정보 입력</StyledCardTitle>
          <StyledCardDescription>
            창고: {selectedLocker} | 자리: {selectedSpace}
          </StyledCardDescription>
          <PhoneInput
            type="tel"
            placeholder="010-1234-5678"
            value={phone}
            onChange={handleInputChange}
          />
        </>
      );
    case 4:
      return (
        <>
          <StyledCardTitle>4단계: 자리 정보 확인</StyledCardTitle>
          <StyledCardDescription>아래 정보를 확인하세요.</StyledCardDescription>
          <p>창고: {selectedLocker}</p>
          <p>자리: {selectedSpace}</p>
          <p>전화번호: {phone}</p>
        </>
      );
    default:
      return null;
  }
};

return (
  <StyledCard>
    <ProgressBar>
      <Progress $width={(currentStep / 4) * 100} />
    </ProgressBar>
    {currentStep > 1 && (
        <button
          onClick={handlePrevStep}
          className="flex items-center gap-2 text-[#969A9D] hover:text-[#7A7D80] transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>이전 단계</span>
        </button>
      )}
      <StyledCardHeader>
        <StyledCardTitle>보관 서비스</StyledCardTitle>
      </StyledCardHeader>
      <StyledCardContent>{renderStepContent()}</StyledCardContent>
      <ButtonContainer>
        {currentStep < 4 && (
          <NextStyledButton
            onClick={handleNextStep}
            disabled={
              (currentStep === 1 && !selectedLocker) ||
              (currentStep === 2 && !selectedSpace) ||
              (currentStep === 3 && !isValidPhoneNumber(phone))
            }
          >
            다음 단계
          </NextStyledButton>
        )}
        <a
          href="/"
          className="flex flex-col items-center"
          style={{ color: "#969A9D" }}
        >
          <Home />
          처음으로
        </a>
      </ButtonContainer>
    </StyledCard>
  );
}