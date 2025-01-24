"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components"

const StyledCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
`

const StyledCardHeader = styled.div`
  margin-bottom: 24px;
`

const StyledCardTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`

const StyledCardDescription = styled.p`
  color: #666;
  font-size: 14px;
`

const StyledCardContent = styled.div``

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 24px;
`

const StyledButton = styled.button<{ $isSelected?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: ${(props) => (props.$isSelected ? "none" : "1px solid #007bff")};
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "transparent")};
  color: ${(props) => (props.$isSelected ? "white" : "#007bff")};
  font-size: 14px;
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
`

const SubmitButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`

const BackButton = styled.button`
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

export default function LuggagePickupForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // 전화번호 처리 로직 추가
    console.log("Phone Number:", phoneNumber)
    setIsLoading(true)
  }

  return (
    <StyledCard>
      {(pathname === "/luggage/save" || pathname === "/luggage/pickup") && (
        <BackButton onClick={() => router.back()}>이전 페이지로 가기</BackButton>
      )}

      <StyledCardHeader>
        <StyledCardTitle>짐 찾기 서비스</StyledCardTitle>
        <StyledCardDescription>짐을 찾기 위해 전화번호를 입력해주세요</StyledCardDescription>
      </StyledCardHeader>
      <StyledCardContent>
        <form onSubmit={handleSubmit}>
          <StyledInput
            type="tel"
            placeholder="전화번호를 입력하세요"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <SubmitButton type="submit" disabled={!phoneNumber || isLoading}>
            {isLoading ? "처리중..." : "제출"}
          </SubmitButton>
        </form>
      </StyledCardContent>
    </StyledCard>
  )
}