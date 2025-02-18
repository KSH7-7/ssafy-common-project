"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

/**
 * Define interfaces to replace "any" usage in our code:
 * - Locker: Represents a single locker with its ID and status.
 * - StoreData: Represents the response from the API containing an array of lockers.
 */
interface Locker {
  lockerId: number;
  lockerStatusId: number;
}

interface StoreData {
  lockers: Locker[];
}

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

// ========================================================
// Add a new styled-component for the warehouse label.
//
// Using "2em" here makes the letter twice the font-size defined on the parent
// (WarehouseButton) so that the change will be responsive.
const WarehouseLabel = styled.span`
  font-size: 10vw;
  font-weight: bold;
  line-height: 1;
  
  @media (min-width: 768px) {
    font-size: 5vw;
  }
`;

// ========================================================

// Create a wrapper component that uses useSearchParams
function LuggageSaveFormContent() {
  const searchParams = useSearchParams();
  const rawLang = searchParams?.get("lang");
  const lang: "ko" | "en" | "cn" = rawLang === "en" ? "en" : rawLang === "cn" ? "cn" : "ko";
  const router = useRouter();

  // Translation dictionary
  const translations = {
    ko: {
      storageService: "보관 서비스",
      step1Title: "1단계: 창고 선택",
      step2Title: "2단계: 자리 선택",
      step3Title: "3단계: 사용자 정보 입력",
      step4Title: "4단계: 자리 정보 확인",
      warehouseDetail: "창고",
      spaceDetail: "자리",
      phoneLabel: "전화번호",
      tokenLabel: "토큰 ID",
      available: "이용가능",
      unavailable: "이용불가",
      total: "총",
      previousStep: "이전 단계",
      nextStep: "다음 단계",
      step4Description: "아래 정보를 확인하세요.",
      selected: "선택됨",
      redirectCountdown: "{countdown} 초 뒤 홈으로 돌아갑니다",
      home: "홈으로",
    },
    en: {
      storageService: "Storage Service",
      step1Title: "Step 1: Choose a Warehouse",
      step2Title: "Step 2: Choose a Space",
      step3Title: "Step 3: Enter User Information",
      step4Title: "Step 4: Confirm Space Information",
      warehouseDetail: "Warehouse",
      spaceDetail: "Space",
      phoneLabel: "Phone Number",
      tokenLabel: "Token ID",
      available: "Available",
      unavailable: "Unavailable",
      total: "Total",
      previousStep: "Previous Step",
      nextStep: "Next Step",
      step4Description: "Please check the details below.",
      selected: "Selected",
      redirectCountdown: "Returning home in {countdown} seconds",
      home: "Home",
    },
    cn: {
      storageService: "存储服务",
      step1Title: "步骤 1: 选择仓库",
      step2Title: "步骤 2: 选择空间",
      step3Title: "步骤 3: 输入用户信息",
      step4Title: "步骤 4: 确认空间信息",
      warehouseDetail: "仓库",
      spaceDetail: "空间",
      phoneLabel: "电话号码",
      tokenLabel: "令牌 ID",
      available: "可用",
      unavailable: "不可用",
      total: "总计",
      previousStep: "上一步",
      nextStep: "下一步",
      step4Description: "请检查以下详细信息。",
      selected: "已选择",
      redirectCountdown: "{countdown} 秒后返回首页",
      home: "首页",
    },
  };

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


  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [sector, setSector] = useState<string>("A");
  const [phone, setPhone] = useState("");
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // 섹터별 사용가능/전체 락커 자리 데이터 상태
  const [sectorsStats, setSectorsStats] = useState<{
    [key: string]: { available: number; total: number };
  }>({});

  // New state for tokenValue from POST response in case 3
  const [tokenValue, setTokenValue] = useState<string | null>(null);

  // Add countdown state near other state declarations
  const [countdown, setCountdown] = useState<number>(8);

  // Add useEffect for countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 4) {
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

  // 컴포넌트 마운트 시 A, B, C 섹터 데이터 모두 fetch
  useEffect(() => {
    const sectors = ["A", "B", "C"];
    const fetchStats = async () => {
      const stats: { [key: string]: { available: number; total: number } } = {};
      await Promise.all(
        sectors.map(async (sec) => {
          try {
            const response = await fetch(`/api/current_store?sector=${sec}`);
            // Cast the JSON response to StoreData
            const data = (await response.json()) as StoreData;
            const total = data.lockers.length;
            // Replace "any" with Locker type in the filter callback
            const available = data.lockers.filter(
              (locker: Locker) =>
                locker.lockerStatusId !== 2 && locker.lockerStatusId !== 3
            ).length;
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
        // Cast the JSON response to StoreData
        const data = (await response.json()) as StoreData;
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

  const handleNextStep = async () => {
    if (currentStep === 3) {
      try {
        // POST 요청: 선택된 자리(selectedSpace)를 lockerId, 입력한 전화번호(phone)를 phoneNumber로 전달
        const response = await axios.post("/api/current_store", {
          lockerId: selectedSpace,
          phoneNumber: phone,
        });
        console.log("POST 요청 성공:", response.data);
        // Save tokenValue received from the response to display in step 4
        setTokenValue(response.data.tokenValue);
      } catch (error) {
        console.error("POST 요청 실패:", error);
        // 에러 발생 시 다음 단계로 진행하지 않음 (원하는 사용자 피드백 로직 추가 가능)
        return;
      }
    }
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
    height: 8px;
    background: #e5e7eb;
    border-radius: 2px;
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
    margin-top: 10px;
  `;

  const StyledCardTitle = styled.h2`
    font-size: 16px;
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
    background-color: ${(props) => (props.$isSelected ? "#007bff" : "#fbfbfb")};
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

  const NextButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "#000880")};
  color: ${(props) => (props.$isSelected ? "white" : "white")};
`;

  const ButtonGridStep1 = styled.div`
    display: grid;
    width: 100%;
    gap: 20px;
    align-items: center;
    grid-template-columns: 1fr;
  `;

  const ButtonGridStep2 = styled.div`
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 1vw;
    width:  80vw;
    height: 40vh;
    overflow: auto;
    background-color: #EBEBEB;
    padding : 1vh;
    border-radius: 8px;
  `;

  /* --- Updated: Sector choice button for 1단계 --- */
  const WarehouseButton = styled(StyledButton)<{ $isSelected?: boolean }>`
    width: 85vw;
    margin: 0 auto;
    height: 120px;
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
      width: 70vw;
      height: 150px;
      font-size: 20px;
    }
    
    @media (min-width: 768px) {
      width: 70vw;
      height: 180px;
      font-size: 20px;
    }
    
    @media (min-width: 1024px) {
      width: 60vw;
      height: 200px;
      font-size: 24px;
    }

    &:hover {
      transform: scale(1.05);
    }
  `;
  // Updated LockerButtonStep2 styled component: set width and height to 0.8vw
  const LockerButtonStep2 = styled(StyledButton)`
    width: 6vw;
    height: 6vw;
    font-size: 2.5vw;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  `;

  const LockerPlaceholder = styled.div`
    width: 6.5vw;
    height: 6.5vw;
  `;

  const Legend = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;
    background-color: #7E7E7E;
    border-radius: 5px;
    padding: 5px
  `;

  const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #f0f0f0;
  `;

  const LegendColor = styled.div<{ $color: string }>`
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.$color};
    border-radius: 2px;
  `;

  // --- 도넛형 그래프 관련 styled-components ---
  const DonutGraphContainer = styled.div<{ size: number }>`
    width: ${(props) => props.size * 1.5 }px;
    height: ${(props) => props.size * 1.5 }px;
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

    @media (min-width: 768px) {
      width: ${(props) => props.size * 1.5}px;
      height: ${(props) => props.size * 1.25}px;
    }

    @media (min-width: 1024px) {
      width: ${(props) => props.size * 2}px;
      height: ${(props) => props.size * 2}px;
    }
  `;

  const DonutInner = styled.div`
    width: 80%;
    height: 80%;
    background: transparent;
    border-radius: 50%;
  `;

  /*
    Updated DonutGraph 컴포넌트:
    - Accepts an optional "size" prop (default: 40). In step 1, we will pass size={80}
      to get a graph that is twice as large.
  */
  function DonutGraph({
    available,
    total,
    size = 40,
  }: {
    available: number;
    total: number;
    size?: number;
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
        size={size}
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
            <StyledCardTitle>{translations[lang].step1Title}</StyledCardTitle>
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
                    <WarehouseLabel>{locker}</WarehouseLabel>

                    <div
                      style={{
                        fontSize: "14px",
                        textAlign: "center",
                        marginTop: "8px",
                      }}
                    >
                      {translations[lang].available}: {available} <br />
                      {translations[lang].unavailable}: {total - available} <br />
                      {translations[lang].total}: {total}
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
      case 2: {
        // Create a grid of items following the pattern:
        // - Row 1: 10 locker items (or empty if fewer are available)
        // - Row 2: next 10 locker items (or empty if fewer are available)
        // - Row 3: 10 empty placeholders (blank row)
        const lockersArray = storeData?.lockers || [];
        const gridItems: (Locker | null)[] = [];
        
        // Process the lockers array in groups of 20
        for (let i = 0; i < lockersArray.length; i += 20) {
          // First row: slice up to 10
          const row1: (Locker | null)[] = lockersArray.slice(i, i + 10);
while (row1.length < 10) {
  row1.push(null);
}
gridItems.push(...row1);

// row2도 동일하게 처리:
const row2: (Locker | null)[] = lockersArray.slice(i + 10, i + 20);
while (row2.length < 10) {
  row2.push(null);
}
gridItems.push(...row2);
          
          // Third row: always 10 empty cells
          gridItems.push(...new Array(10).fill(null));
        }

        return (
          <>
            <StyledCardTitle>{translations[lang].step2Title}</StyledCardTitle>
            <Legend>
              <LegendItem>
                <LegendColor $color="#fbfbfb" />
                <span>{translations[lang].available}</span>
              </LegendItem>
              <LegendItem>
                <LegendColor $color="#007bff" />
                <span>{translations[lang].selected}</span>
              </LegendItem>
              <LegendItem>
                <LegendColor $color="#cccccc" />
                <span>{translations[lang].unavailable}</span>
              </LegendItem>
            </Legend>
            <ButtonGridStep2 className = "scroll2">
              {gridItems.map((locker, index) =>
                locker ? (
                  <LockerButtonStep2
                    key={`locker-${locker.lockerId}-${index}`}
                    type="button"
                    $isSelected={selectedSpace === locker.lockerId}
                    disabled={
                      locker.lockerStatusId === 2 || locker.lockerStatusId === 3
                    }
                    onClick={() => setSelectedSpace(locker.lockerId)}
                  >
                    {locker.lockerId}
                  </LockerButtonStep2>
                ) : (
                  // Render the placeholder for empty cells.
                  <LockerPlaceholder key={`placeholder-${index}`} />
                )
              )}
            </ButtonGridStep2>
          </>
        );
      }
      case 3:
        return (
          <>
            <StyledCardTitle>{translations[lang].step3Title}</StyledCardTitle>
            <StyledCardDescription>
              {translations[lang].warehouseDetail}: {selectedLocker} | {translations[lang].spaceDetail}: {selectedSpace}
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
            <StyledCardTitle>{translations[lang].step4Title}</StyledCardTitle>
            <StyledCardDescription>{translations[lang].step4Description}</StyledCardDescription>
            <p>
              {translations[lang].warehouseDetail}: {selectedLocker}
            </p>
            <p>
              {translations[lang].spaceDetail}: {selectedSpace}
            </p>
            <p>
              {translations[lang].phoneLabel}: {phone}
            </p>
            {tokenValue && (
              <p>
                {translations[lang].tokenLabel}: {tokenValue}
              </p>
            )}
            <p>
              {translations[lang].redirectCountdown.replace(
                "{countdown}",
                countdown.toString()
              )}
            </p>
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
        <a onClick={handlePrevStep} style={{ color: "#969A9D", cursor: "pointer" }}>
          ← {translations[lang].previousStep}
        </a>
      )}
      <StyledCardHeader>
        <StyledCardTitle>{translations[lang].storageService}</StyledCardTitle>
      </StyledCardHeader>
      <StyledCardContent>{renderStepContent()}</StyledCardContent>
      <div>
        {currentStep < 4 && (
          <NextButton
            onClick={handleNextStep}
            disabled={
              (currentStep === 1 && !selectedLocker) ||
              (currentStep === 2 && !selectedSpace) ||
              (currentStep === 3 && !isValidPhoneNumber(phone))
            }
          >
            {translations[lang].nextStep}
          </NextButton>
        )}
      </div>
      
      <HomeLinkWrapper onClick={() => router.push("/")}>
        <FaHome size={32} color="#969A9D" />
        <HomeText>{translations[lang].home}</HomeText>
      </HomeLinkWrapper>
      <style jsx global>{`
        .scroll2::-webkit-scrollbar {
          width: 5px;
        }
        .scroll2::-webkit-scrollbar-thumb {
          background: #666;
        }
        .scroll2::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </StyledCard>
  );
}

// Main component that wraps the content with Suspense
export default function LuggageSaveForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LuggageSaveFormContent />
    </Suspense>
  );
}