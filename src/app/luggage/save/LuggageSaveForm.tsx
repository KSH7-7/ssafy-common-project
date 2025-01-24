"use client"

import { useState } from "react";
import styled from "styled-components";

const ProgressBar = styled.div`
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
`

const Progress = styled.div<{ $width: number }>`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: linear-gradient(to right, #4A1B9D, #00A3FF);
  transition: width 0.3s ease;
`

const StyledCard = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 0px;
  margin: 0px;
  min-height: 100vh; /* 최소 100vh를 유지 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%; /* 기본적으로 100%로 설정 */

  /* 미디어 쿼리 추가: 화면 크기에 따라 스타일 변경 */
  @media (max-width: 768px) {
    padding: 0px; /* 작은 화면에서는 여백을 늘림 */
    width: 100%; /* 작은 화면에서는 너비를 90%로 설정 */
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0px; /* 중간 화면 크기에서 여백을 증가 */
    width: 100%; /* 화면 크기가 커질수록 너비를 80%로 설정 */
  }

  @media (min-width: 1024px) {
    padding: 0px; /* 큰 화면에서는 여백을 더 크게 설정 */
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button<{ $isSelected?: boolean }>`
  padding: 16px 24px;
  border-radius: 8px;
  border: ${(props) => (props.$isSelected ? "none" : "1px solid #007bff")};
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "transparent")};
  color: ${(props) => (props.$isSelected ? "white" : "#007bff")};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#0056b3" : "#e6f2ff")};
  }

  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const LockerButton = styled(StyledButton)`
  height: 100px;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
`;

const SubmitButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
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

export default function LuggageSaveForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [phone, setPhone] = useState("");

  const spaces = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: i % 2 === 0 ? "inUse" : "available",
  }));

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
    const input = e.target.value;
    setPhone(input); // 유효성 검사 없이 입력값을 그대로 상태에 저장
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StyledCardTitle>1단계: 창고 선택</StyledCardTitle>
            <ButtonGrid>
              {["A", "B", "C"].map((locker) => (
                <LockerButton
                  key={locker}
                  type="button"
                  $isSelected={selectedLocker === locker}
                  onClick={() => setSelectedLocker(locker)}
                >
                  {locker}
                </LockerButton>
              ))}
            </ButtonGrid>
          </>
        );
      case 2:
        return (
          <>
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
            <ButtonGrid>
              {spaces.map((space) => (
                <LockerButton
                  key={space.id}
                  type="button"
                  $isSelected={selectedSpace === space.id}
                  disabled={space.status === "inUse"}
                  onClick={() => setSelectedSpace(space.id)}
                >
                  {space.id}
                </LockerButton>
              ))}
            </ButtonGrid>
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
              onChange={handleInputChange} // 입력이 있을 때마다 상태 업데이트
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
          <a onClick={handlePrevStep} style={{ color: '#969A9D' }}>이전 단계</a>
        )}
      <StyledCardHeader>
        <StyledCardTitle>보관 서비스</StyledCardTitle>
      </StyledCardHeader>
      <StyledCardContent>{renderStepContent()}</StyledCardContent>
      <div>
        {currentStep > 1 && (
          <StyledButton onClick={handlePrevStep}>이전 단계</StyledButton>
        )}
        {currentStep < 4 && (
          <StyledButton
            onClick={handleNextStep}
            disabled={
              (currentStep === 1 && !selectedLocker) ||
              (currentStep === 2 && !selectedSpace) ||
              (currentStep === 3 && !isValidPhoneNumber(phone))
            }
          >
            다음 단계
          </StyledButton>
        )}
      </div>
    </StyledCard>
  );
}
