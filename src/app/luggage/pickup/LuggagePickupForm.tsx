"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styled from "styled-components"
import { FaHome } from "react-icons/fa"

// =============================================================================
// Styled Components
// =============================================================================

const StyledCard = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  min-height: calc(70vh);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding-bottom: 32px;

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
  background-color: ${(props) =>
    props.$isSelected ? "#007bff" : "transparent"};
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
  height: 4px;
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
// Modal Styled Components
// =============================================================================

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  margin: 0 0 8px;
`;

const ModalMessage = styled.p`
  margin: 0 0 16px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

// =============================================================================
// Home Link Styled Components
// =============================================================================

const HomeLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.2s;
  width: 60px;
  }
`;

const HomeText = styled.span`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #969A9D;
`;

// =============================================================================
// Translations Dictionary (KO/EN)
// =============================================================================

const translations = {
  ko: {
    step1Title: "1단계: 사물함 정보 입력",
    step2Title: "수령 완료",
    submit: "제출",
    lockerPlaceholder: "사물함 번호를 입력하세요",
    authCodePlaceholder: "인증번호를 입력하세요",
    pickupCompleteMessage: "사물함 {lockerNumber}의 수령이 완료되었습니다.",
    error: "오류",
    errorOccurred: "예상치 못한 오류가 발생했습니다.",
    close: "닫기",
  },
  en: {
    step1Title: "Step 1: Enter Locker Information",
    step2Title: "Pickup Complete",
    submit: "Submit",
    lockerPlaceholder: "Enter locker number",
    authCodePlaceholder: "Enter the authentication code",
    pickupCompleteMessage: "Locker {lockerNumber} pickup is complete.",
    error: "Error",
    errorOccurred: "An unexpected error occurred.",
    close: "Close",
  },
};

// =============================================================================
// LuggagePickupMultiStepForm Component
// =============================================================================

export default function LuggagePickupMultiStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawLang = searchParams?.get("lang");
  const lang: "ko" | "en" = rawLang === "en" ? "en" : "ko";
  const homeLabel = lang === "ko" ? "홈으로" : "Home";

  // 단계 상태 : (1) 입력, (2) 수령 완료
  const [currentStep, setCurrentStep] = useState(1);

  // 1단계: 사물함 번호와 인증번호 입력 상태
  const [lockerNumber, setLockerNumber] = useState("");
  const [authCode, setAuthCode] = useState("");

  // State for error modal message
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  // Close modal handler
  const closeErrorModal = () => {
    setErrorModalMessage(null);
  };

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
          const errorText = await response.text();
          try {
            const errorObj = JSON.parse(errorText);
            if (errorObj.message) {
              setErrorModalMessage(errorObj.message);
            } else {
              setErrorModalMessage(translations[lang].errorOccurred);
            }
          } catch (jsonError) {
            setErrorModalMessage(errorText);
          }
          return;
        }
        const data = await response.json();
        console.log("Success:", data);
        handleNextStep();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Submission error:", error.message);
          setErrorModalMessage("Submission error: " + error.message);
        } else {
          console.error("Submission error:", error);
          setErrorModalMessage("Submission error occurred.");
        }
      }
    }
  };

  // 스텝별 렌더링 함수
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>
                {translations[lang].step1Title}
              </StyledCardTitle>
            </StyledCardHeader>
            <form onSubmit={handleUserInfoSubmit}>
              <StyledInput
                type="number"
                placeholder={translations[lang].lockerPlaceholder}
                value={lockerNumber}
                onChange={(e) => setLockerNumber(e.target.value)}
              />
              <StyledInput
                type="number"
                placeholder={translations[lang].authCodePlaceholder}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <NextButton type="submit" disabled={!lockerNumber || !authCode}>
                {translations[lang].submit}
              </NextButton>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <StyledCardHeader>
              <StyledCardTitle>
                {translations[lang].step2Title}
              </StyledCardTitle>
            </StyledCardHeader>
            <p>
              {translations[lang].pickupCompleteMessage.replace(
                "{lockerNumber}",
                lockerNumber
              )}
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StyledCard>
        <ProgressBar>
          <Progress $width={(currentStep / 2) * 100} />
        </ProgressBar>
        <div style={{ padding: "16px" }}>
          <StyledCardContent>{renderStepContent()}</StyledCardContent>
          {/* Home link with icon and text is available on every step */}
          <HomeLinkWrapper onClick={() => router.push("/")}>
            <FaHome size={32} color="#969A9D" />
            <HomeText>{homeLabel}</HomeText>
          </HomeLinkWrapper>
        </div>
      </StyledCard>
      {errorModalMessage && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>{translations[lang].error}</ModalTitle>
            <ModalMessage>{errorModalMessage}</ModalMessage>
            <ModalButton type="button" onClick={closeErrorModal}>
              {translations[lang].close}
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}