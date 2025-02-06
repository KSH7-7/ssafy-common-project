"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

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

export default function LuggageSaveForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [spaces, setSpaces] = useState<{ id: number; status: string }[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [sector, setSector] = useState<string>("A");
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // 섹터별 사용가능/전체 락커 자리 데이터 상태
  const [sectorsStats, setSectorsStats] = useState<{
    [key: string]: { available: number; total: number };
  }>({});

  // 컴포넌트 마운트 시 A, B, C 섹터 데이터 모두 fetch
  useEffect(() => {
    const sectors = ["A", "B", "C"];
    const fetchStats = async () => {
      const stats: { [key: string]: { available: number; total: number } } = {};
      await Promise.all(
        sectors.map(async (sec) => {
          try {
            const response = await fetch(`/api/current_store?sector=${sec}`);
            const data = await response.json();
            const total = data.lockers?.length || 0;
            const available =
              data.lockers?.filter(
                (locker: any) =>
                  locker.lockerStatusId !== 2 && locker.lockerStatusId !== 3
              ).length || 0;
            stats[sec] = { available, total };
          } catch (error) {
            console.error("Error fetching stats for sector", sec, error);
            stats[sec] = { available: 0, total: 0 };
          }
        })
      );
      setSectorsStats(stats);
    };

    fetchStats();
  }, []);

  // 현재 선택된 섹터에 대한 storeData 호출 (2단계에서 사용)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/current_store?sector=${sector}`);
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sector]);

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [phone]);

  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId);
    setSector(lockerId);
    setSelectedSpace(null);
  };

  const handleNextStep = () => {
    setCurrentStep((prevPage) => prevPage + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevPage) => Math.max(1, prevPage - 1));
  };

  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력값에서 '-'를 모두 제거
    const digitsOnly = e.target.value.replace(/-/g, '');
    // 최대 11자리까지만 허용 (3글자-4글자-4글자)
    const limited = digitsOnly.slice(0, 11);

    let formatted = "";
    if (limited.length < 4) {
      // 3글자 미만이면 그대로 사용
      formatted = limited;
    } else if (limited.length < 8) {
      // 3글자 이상 8글자 미만이면 3글자 뒤에 '-' 추가
      formatted = limited.slice(0, 3) + "-" + limited.slice(3);
    } else {
      // 8글자 이상이면 3글자, 4글자, 나머지(최대 4글자)로 포맷팅
      formatted = limited.slice(0, 3) + "-" + limited.slice(3, 7) + "-" + limited.slice(7);
    }
    setPhone(formatted);
  };

  // 창고 선택 버튼 클릭 처리 (섹터 변경)
  const handleSectorSelect = (selectedSector: string) => {
    setSector(selectedSector);
  };

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
    transition: width 0.3s ease;
  `;

  const StyledCard = styled.div`
    background-color: transparent;
    border-radius: 8px;
    padding: 0;
    margin: 0;
    min-height: 70vh;
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
    margin-bottom: 10px;
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
  
  
    &:disabled {
      background-color: #cccccc;
      border-color: #cccccc;
      color: #666;
      cursor: not-allowed;
    }
  `;

  const ButtonGridStep1 = styled.div`
    display: grid;
    width: 100%;
    gap: 30px;
    align-items: center;
    grid-template-columns: 1fr;
  `;

  const ButtonGridStep2 = styled.div`
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    gap: 8px;
    width: 100%;
  `;

  /* --- Updated: Sector choice button for 1단계 --- */
  const WarehouseButton = styled(StyledButton)<{ $isSelected?: boolean }>`
    width: 200%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
  
    background-color: ${(props) => (props.$isSelected ? "#0059FF" : "#FFFFFF")};
    border: 1px solid ${(props) => (props.$isSelected ? "#9B0EFF" : "#EBEBEB")};
    color: ${(props) => (props.$isSelected ? "#FFFFFF" : "#454545")};
    opacity: ${(props) => (props.$isSelected ? 0.65 : 1)};
    ${(props) =>
      props.$isSelected &&
      `
      -webkit-text-stroke: 1px #EBEBEB;
    `}
  
    @media (min-width: 608px) {
      width: 300%;
      height: 150px;
      font-size: 20px;
    };
    
    @media (min-width: 768px) {
      width: 340%;
      height: 180px;
      font-size: 20px;
    };
    
    @media (min-width: 1024px) {
      width: 450%;
      height: 200px;
      font-size: 24px;
    }

    &:hover {
      transform: translateX(-50%) scale(1.05);
    }
  `;
  // 기존 도넛형 그래프는 그대로 남겨두었으며, 다른 단계에서 사용합니다.
  const LockerButtonStep2 = styled(StyledButton)`
    aspect-ratio: 1;
    min-width: 40px;
    font-size: 16px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  
    @media (min-width: 768px) {
      font-size: 20px;
      min-width: 50px;
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

  // --- 도넛형 그래프 관련 styled-components ---
  const DonutGraphContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    -webkit-mask: radial-gradient(
      closest-side,
      transparent calc(60% - 2px),
      black calc(60%)
    );
    mask: radial-gradient(
      closest-side,
      transparent calc(60% - 2px),
      black calc(60%)
    );
  `;

  const DonutInner = styled.div`
    width: 80%;
    height: 80%;
    background: transparent;
    border-radius: 50%;
  `;

  /*
    DonutGraph 컴포넌트:
    1. 전체 자리에서 사용 가능한 자리를 뺀 불가능한 자리 비율을 계산합니다.
    2. 불가능한 자리 비율이 30% 이하이면 하늘색, 30% 초과 65% 이하이면 주황색, 65% 초과이면 빨간색을 적용합니다.
    3. CSS mask를 이용해 중앙이 투명한 도넛형 그래프를 표시합니다.
    (그라데이션 효과는 제거되었습니다.)
  */
  function DonutGraph({
    available,
    total,
  }: {
    available: number;
    total: number;
  }) {
    const nonAvailablePercentage =
      total > 0 ? ((total - available) / total) * 100 : 0;
    const angle = nonAvailablePercentage * 3.6; // 100% → 360도

    let fillColor = "#00a3ff"; // 하늘색 (불가능한 자리 30% 이하)
    if (nonAvailablePercentage > 30 && nonAvailablePercentage <= 65) {
      fillColor = "#fa8c16"; // 주황색
    } else if (nonAvailablePercentage > 65) {
      fillColor = "#ff4d4f"; // 빨간색
    }
    return (
      <DonutGraphContainer
        style={{
          background: `conic-gradient(${fillColor} 0deg, ${fillColor} ${angle}deg, #e5e7eb ${angle}deg, #e5e7eb 360deg)`
        }}
      >
        <DonutInner />
      </DonutGraphContainer>
    );
  }
  // ----------------------------------------------------------

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <StyledCardTitle>1단계: 창고 선택</StyledCardTitle>
            <ButtonGridStep1>
              {["A", "B", "C"].map((locker) => {
                const available = sectorsStats[locker]?.available || 0;
                const total = sectorsStats[locker]?.total || 0;
                return (
                  <WarehouseButton
                    key={locker}
                    type="button"
                    $isSelected={selectedLocker === locker}
                    onClick={() => {
                      handleSectorSelect(locker);
                      handleLockerSelect(locker);
                    }}
                  >
                    <div>{locker}</div>
                    
                    <div style={{ fontSize: "14px", textAlign: "center", marginTop: "8px" }}>
                      이용가능: {available} <br />
                      이용불가: {total - available} <br />
                      총: {total}
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <DonutGraph available={available} total={total} />
                    </div>
                  </WarehouseButton>
                );
              })}
            </ButtonGridStep1>
          </div>
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
                <span>이용 불가</span>
              </LegendItem>
            </Legend>
            <ButtonGridStep2>
              {(storeData?.lockers || []).map((locker: any) => (
                <LockerButtonStep2
                  key={locker.lockerId}
                  type="button"
                  $isSelected={selectedSpace === locker.lockerId}
                  disabled={
                    locker.lockerStatusId === 2 || locker.lockerStatusId === 3
                  }
                  onClick={() => setSelectedSpace(locker.lockerId)}
                >
                  {locker.lockerId}
                </LockerButtonStep2>
              ))}
            </ButtonGridStep2>
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
              maxLength={13}
              ref={phoneInputRef}
            />
          </>
        );
      case 4:
        return (
          <>
            <StyledCardTitle>4단계: 자리 정보 확인</StyledCardTitle>
            <StyledCardDescription>
              아래 정보를 확인하세요.
            </StyledCardDescription>
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
        <a onClick={handlePrevStep} style={{ color: "#969A9D" }}>
          이전 단계
        </a>
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