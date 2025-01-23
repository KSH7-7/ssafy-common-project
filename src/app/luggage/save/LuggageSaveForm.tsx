"use client"

import { useState } from "react"
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

const LockerButton = styled(StyledButton)`
  height: 80px;
  font-size: 24px;
  font-weight: bold;
`

const SubmitButton = styled(StyledButton)`
  width: 100%;
  margin-top: 24px;
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`

export default function LuggageSaveForm() {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const lockers = ["A", "B", "C"]

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically handle the form submission
    console.log("Selected locker:", selectedLocker)
    setIsLoading(true)
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <StyledCardTitle>보관 서비스</StyledCardTitle>
        <StyledCardDescription>짐을 맡기실 보관함을 선택해주세요</StyledCardDescription>
      </StyledCardHeader>
      <StyledCardContent>
        <form onSubmit={handleSubmit}>
          <ButtonGrid>
            {lockers.map((locker) => (
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

          <SubmitButton type="submit" disabled={!selectedLocker || isLoading}>
            {isLoading ? "처리중..." : "제출"}
          </SubmitButton>
        </form>
      </StyledCardContent>
    </StyledCard>
  )
}

