"use client"

import React, { useState, useEffect } from "react"
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
  justify-content: center;
  width: 100%;

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
    /* Chrome, Safari, Edge, Opera에서 숫자 spinner 제거 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox에서 숫자 spinner 제거 */
  &[type='number'] {
    -moz-appearance: textfield;
  }

`;

const StyledButton = styled.button<{ $isSelected?: boolean }>`
  padding: 16px 24px;
  border-radius: 8px;
  border: ${(props) => (props.$isSelected ? "none" : "1px solid #1975FF")};
  background-color: ${(props) =>
    props.$isSelected ? "#007bff" : "#000880"};
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
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "#000880")};
  color: ${(props) => (props.$isSelected ? "white" : "white")};
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e5e7eb;
  border-radius: 2px;
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
`;

const HomeText = styled.span`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #969A9D;
`;

// =============================================================================
// Translations Dictionary (KO/EN/CN)
// =============================================================================

const translations = {
  ko: {
    step1Title: "사물함 정보 입력",
    step2Title: "수령 완료",
    submit: "제출",
    lockerPlaceholder: "사물함 번호를 입력하세요",
    authCodePlaceholder: "인증번호를 입력하세요",
    pickupCompleteMessage: "사물함 \n{lockerNumber}\n 수령이 완료되었습니다.",
    error: "오류",
    errorOccurred: "예상치 못한 오류가 발생했습니다.",
    close: "닫기",
    redirectCountdown: "{countdown} 초 뒤 홈으로 돌아갑니다",
  },
  en: {
    step1Title: "Enter Locker Information",
    step2Title: "Pickup Complete",
    submit: "Submit",
    lockerPlaceholder: "Enter locker number",
    authCodePlaceholder: "Enter the authentication code",
    pickupCompleteMessage: "Locker \n{lockerNumber}\n pickup is complete.",
    error: "Error",
    errorOccurred: "An unexpected error occurred.",
    close: "Close",
    redirectCountdown: "Returning home in {countdown} seconds",
  },
  cn: {
    step1Title: "输入储物柜信息",
    step2Title: "取件完成",
    submit: "提交",
    lockerPlaceholder: "请输入储物柜号码",
    authCodePlaceholder: "请输入认证码",
    pickupCompleteMessage: "储物柜 \n{lockerNumber}\n 的取件已完成。",
    error: "错误",
    errorOccurred: "发生意外错误。",
    close: "关闭",
    redirectCountdown: "{countdown} 秒后返回首页",
  },
};

const FadeAnimation = styled.div<{ $show: boolean }>`
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`;

const FadeInContent = styled.div<{ $show: boolean }>`
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
  transition-delay: 1s;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  min-width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 300px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #E8F5E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    width: 40px;
    height: 40px;
    color: #4CAF50;
  }
`;

const SuccessTitle = styled(StyledCardTitle)`
  color: #2E7D32;
  font-size: 24px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  color: #4A5568;
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 24px;
  white-space: pre-line;
`;


const LockerNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #007bff; 
  margin: 16px 0;
  padding: 12px;
  display: inline-block;
`;

const TimeStamp = styled.div`
  color: #718096;
  font-size: 14px;
  margin-top: 16px;
`;
const CountdownText = styled.div`
  color: #6c757d;
  font-size: 14px;
  margin-top: 24px;
  font-style: italic;
`;

// =============================================================================
// LuggagePickupMultiStepForm Component
// =============================================================================

export default function LuggagePickupMultiStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawLang = searchParams?.get("lang");
  const lang: "ko" | "en" | "cn" = rawLang === "en" ? "en" : rawLang === "cn" ? "cn" : "ko";
  const homeLabel = lang === "ko" ? "홈으로" : lang === "en" ? "Home" : lang === "cn" ? "首页" : "Home";

  const [currentStep, setCurrentStep] = useState(1);
  const [lockerNumber, setLockerNumber] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);
  const [showInitial, setShowInitial] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);
  const closeErrorModal = () => {
    setErrorModalMessage(null);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 2) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = '/';
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep]);


  useEffect(() => {
    if (currentStep === 2) {
      // 초기 아이콘과 타이틀을 1초 동안 보여줌
      setTimeout(() => {
        setShowInitial(false);
      }, 1000);

      // 0.7초 후에 컨텐츠를 보여줌
      setTimeout(() => {
        setShowContent(true);
      }, 700);
    }
  }, [currentStep]);

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
          } catch {
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

  const renderStep1 = () => (
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

  const renderStep2 = () => (
    <SuccessCard>
      <FadeAnimation $show={showInitial}>
        <SuccessIcon>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </SuccessIcon>
        <SuccessTitle>
          {translations[lang].step2Title}
        </SuccessTitle>
      </FadeAnimation>
      
      <FadeInContent $show={showContent}>
        <SuccessMessage>
          {translations[lang].pickupCompleteMessage.split('{lockerNumber}').map((text, index) => (
            <React.Fragment key={`message-part-${index}`}>
              {index === 0 ? (
                text
              ) : (
                <>
                  <LockerNumber>
                    {lockerNumber}
                  </LockerNumber>
                  {text}
                </>
              )}
            </React.Fragment>
          ))}
        </SuccessMessage>
        <TimeStamp>
          {new Date().toLocaleString(
            lang === 'ko' ? 'ko-KR' : 
            lang === 'cn' ? 'zh-CN' : 
            'en-US'
          )}
        </TimeStamp>
        <CountdownText>
          {translations[lang].redirectCountdown.replace(
            "{countdown}",
            countdown.toString()
          )}
        </CountdownText>
      </FadeInContent>
    </SuccessCard>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
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
